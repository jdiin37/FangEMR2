package model;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import library.dateutility.DateComputeUtil;
import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

import static library.utility.MapEntryUtil.getSubMapByKeyList;
import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2017/10/20.
 */
public class EMRViewList {
    private Connection con;
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private JsonArray jsonArray = new JsonArray();
    private OrRecord orRecord;
    private PatinpEX patinpEX;

    public EMRViewList(Connection con) {
        this.con = con;
        patinpEX = new PatinpEX(con);
        orRecord = new OrRecord(con);
    }

    public List<Map<String, Object>> queryPTListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.ckin_date sorted_date, 'INP' visit_type, a.chart_no, a.serno, a.ckin_date start_date, a.discharge_date end_date, " +
                "       0 admit_days, a.vs, b.emp_name doctor_name, a.div_no, c.div_name " +
                "  FROM patinp a, employee b, division c " +
                " WHERE a.ckin_date BETWEEN ? AND ? " +
                "   AND a.chart_no = ? " +
                "   AND a.status <> 0 " +
                "   AND a.vs = b.emp_no(+) " +
                "   AND a.div_no = c.div_no(+) " +
                "UNION ALL     " +
                "SELECT a.view_date sorted_date, 'OPD' visit_type, a.chart_no, a.duplicate_no, a.view_date start_date, null end_date, " +
                "       0 admit_days, a.doctor_no, b.emp_name doctor_name, a.div_no, c.div_name " +
                "  FROM patopd a, employee b, division c " +
                " WHERE a.view_date BETWEEN ? AND ? " +
                "   AND a.chart_no = ? " +
                "   AND (a.opd_clerk IS NOT NULL OR a.treat_clerk IS NOT NULL) " +
                "   AND a.doctor_no = b.emp_no(+) " +
                "   AND a.div_no = c.div_no(+) " +
                "ORDER BY sorted_date desc, end_date desc nulls last ";

        EntityFactory emrViewListEntity = new EntityFactory(con, queryString);
        return emrViewListEntity.findMultiple(new Object[]{startDate, endDate, chartNo, startDate, endDate, chartNo});
    }

    private List<Map<String, Object>> getInpList(List<Map<String, Object>> objects) {
        List<Map<String, Object>> result;
        String startDate;
        String endDate;
        List<String> keyList = Arrays.asList("visit_type", "chart_no", "serno", "start_date", "end_date", "admit_days",
                "vs", "doctor_name", "div_no", "div_name");

        result = objects.stream()
                .filter(map -> map.get("visit_type").equals("INP"))
                .map(map -> getSubMapByKeyList(map, keyList))
                .collect(Collectors.toList());

        for (Map<String, Object> map : result) {
            startDate = MapUtil.castToStr(map.get("start_date"));
            endDate = MapUtil.castToStr(map.get("end_date"));
            map.put("admit_days", DateComputeUtil.getAdmitDays(startDate, endDate));
        }

        return result;
    }

    private List<Map<String, String>> getAdmitList(List<Map<String, Object>> inpListMap) {
        List<Map<String, String>> admitList = new ArrayList<>();
        for (Map<String, Object> map : inpListMap) {
            Map<String, String> tempMap = new LinkedHashMap<>();
            for (Map.Entry entry : map.entrySet()) {
                if (entry.getKey().equals("start_date") || entry.getKey().equals("end_date")) {
                    tempMap.put((String)entry.getKey(), (String)entry.getValue());
                }
            }
            admitList.add(tempMap);
        }

        return admitList;
    }

    private Map<String, Object> getOpdMap(List<Map<String, Object>> objects, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();

        int chartNo = objects.stream()
                .map(map -> castToInt(map.get("chart_no")))
                .findFirst().get();

        List<String> viewDateList = objects.stream()
                .filter(map -> castToStr(map.get("visit_type")).equals("OPD"))
                .filter(map -> map.get("start_date") != null
                            && castToStr(map.get("start_date")).compareTo(startDate) > 0
                            && castToStr(map.get("start_date")).compareTo(endDate) <= 0)
                .map(map -> castToStr(map.get("start_date")))
                .collect(Collectors.toList());

        int count = viewDateList.size();

        Optional<String> maxViewDate = viewDateList.stream()
                .max(String::compareTo);
        Optional<String> minViewDate = viewDateList.stream()
                .min(String::compareTo);

        if (maxViewDate.isPresent() && minViewDate.isPresent()) {
            result.put("visit_type", "OPD");
            result.put("chart_no", chartNo);
            result.put("start_date", minViewDate.get());
            result.put("end_date", maxViewDate.get());
            result.put("count", count);
        }

        return result;
    }

    private List<Map<String, Object>> mergeInpListWithOpdList(List<Map<String, Object>> objects, String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> opdMap;

        List<Map<String, Object>> inpListMap = getInpList(objects);
        List<Map<String, String>> admitListMap = getAdmitList(inpListMap);

        if (inpListMap.isEmpty()) {
            opdMap = getOpdMap(objects, startDate, endDate);
            if (!opdMap.isEmpty()) {
                result.add(opdMap);
            }
        }

        for (int idx = 0; idx < inpListMap.size(); idx++) {
            String opdStartDate;
            String opdEndDate;

            // add last opd data, the range of view_date was between last discharge_date and now
            if (idx == 0) {
                // startDate: current 'discharge_date' if 'discharge_date' is null then get current 'ckin_date'
                // endDate : endDate
                opdStartDate = admitListMap.get(idx).get("end_date") != null
                        ? admitListMap.get(idx).get("end_date")
                        : admitListMap.get(idx).get("start_date");
                opdEndDate = endDate;
                opdMap = getOpdMap(objects, opdStartDate, opdEndDate);

                if (!opdMap.isEmpty()) {
                    result.add(opdMap);
                }
            }

            // add current inp data
            result.add(inpListMap.get(idx));

            // add opd data between current inp and previous inp
            // the range of view_date was between current ckin_date and previous discharge_date
            if (idx >= 0 && idx <= inpListMap.size() - 2) {
                // startDate: previous 'discharge_date' if 'discharge_date' is null then get previous 'ckin_date'
                // endDate : current 'ckin_date'
                opdStartDate = admitListMap.get(idx+1).get("end_date") != null
                        ? admitListMap.get(idx+1).get("end_date")
                        : admitListMap.get(idx+1).get("start_date");
                opdEndDate = admitListMap.get(idx).get("start_date");
                opdMap = getOpdMap(objects, opdStartDate, opdEndDate);

                if (!opdMap.isEmpty()) {
                    result.add(opdMap);
                }
            }

            // add first opd data, the range of view_date was between first ckin_date and start_date
            if (idx == inpListMap.size() - 1) {
                // startDate: startDate'
                // endDate :  current ckin_date
                opdStartDate = startDate;
                opdEndDate = admitListMap.get(idx).get("start_date");

                opdMap = getOpdMap(objects, opdStartDate, opdEndDate);

                if (!opdMap.isEmpty()) {
                    result.add(opdMap);
                }
            }
        }

        return result;
    }

    private List<Map<String, Object>> getInpDisListByChartNoSerno(int chartNo, int serno) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            result = patinpEX.queryInpDisListByChartNoSerno(chartNo, serno);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private List<Map<String, Object>> getPatinpMainDisList(int chartNo, int serno) {
        List<Map<String, Object>> disicdList;

        List<Map<String, Object>> disMapList = getInpDisListByChartNoSerno(chartNo, serno);

        List<String> keyList = Arrays.asList("disease_code", "code_name_c", "code_name_e");

        // get main disease with cols in {disease_code, code_name_c, code_name_e }
        disicdList = disMapList.stream()
                .filter(map -> castToInt(map.get("rec_count")) == 1)
                .map(map -> getSubMapByKeyList(map, keyList))
                .collect(Collectors.toList());

        return disicdList;
    }

    private List<Map<String, Object>> getOPDataByChartNoDateRange(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            result = orRecord.queryOPDataByChartNoDateRange(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private List<Map<String, Object>> getOPList(Map<String, Object> map) {
        List<Map<String, Object>> originalMapList;
        List<Map<String, Object>> mapList = new ArrayList<>();
        List<Map<String, Object>> resultList = new ArrayList<>();

        int chartNo = castToInt(map.get("chart_no"));
        String startDate = castToStr(map.get("start_date"));
        String endDate = castToStr(map.get("end_date"));
        String visitType = castToStr(map.get("visit_type"));

        originalMapList = getOPDataByChartNoDateRange(chartNo, startDate, endDate);

        if (!originalMapList.isEmpty()) {
            List<String> colList = Arrays.asList("op_date", "code1", "code2", "code3", "full_name_1", "full_name_2", "full_name_3");
            
            if ("INP".equals(visitType)) {
                mapList = originalMapList.stream()
                        .filter(innerMap -> "I".equals(innerMap.get("inp_opd")))
                        .map(innerMap -> getSubMapByKeyList(innerMap, colList))
                        .collect(Collectors.toList());
            }
            if ("OPD".equals(visitType)) {
                mapList = originalMapList.stream()
                        .filter(innerMap -> "O".equals(innerMap.get("inp_opd")))
                        .map(innerMap -> getSubMapByKeyList(innerMap, colList))
                        .collect(Collectors.toList());
            }
            if ("ALL".equals(visitType)) {
                mapList = originalMapList.stream()
                        .map(innerMap -> getSubMapByKeyList(innerMap, colList))
                        .collect(Collectors.toList());   
            }

            for (Map<String, Object> opMap : mapList) {
                for (int i= 1; i < 4; i++) {
                    Map<String, Object> resultMap = new LinkedHashMap<>();
                    String code = "code" + i; // ex. code1, code2, code3
                    String name = "full_name_" + i; // ex. full_name_1, full_name_2, full_name_3

                    if (opMap.get(code) != null && !opMap.get(code).equals("")) {
                        resultMap.put("op_date", opMap.get("op_date"));
                        resultMap.put("op_code", opMap.get(code));
                        resultMap.put("op_name", opMap.get(name));
                        resultList.add(resultMap);
                    }
                }
            }
        }
        return resultList;
    }

    public String getEmrViewListOpdInpByChartNoDateRange(int chartNo, String startDate, String endDate) {
        try {

            objects = queryPTListByChartNoDateRange(chartNo, startDate, endDate);

            if (objects.size() > 0) {
                // extract patinp data from objects
                List<Map<String, Object>> inpListMap = getInpList(objects);

                // from patinp data list merge patopd data
                List<Map<String, Object>> emrViewListMap = mergeInpListWithOpdList(objects, startDate, endDate);

                // from emrViewListMap merge disease and op
                String visitType;
                for (Map<String, Object> map : emrViewListMap) {
                    jsonObject = MapUtil.mapToJsonObject(map);

                    visitType = castToStr(map.get("visit_type"));

                    // if map of data is INP then add main disease
                    if (visitType.equals("INP")) {
                        List<Map<String, Object>> disicdListOfMap = getPatinpMainDisList(castToInt(map.get("chart_no")), castToInt(map.get("serno")));
                        if (!disicdListOfMap.isEmpty()) {
                            jsonObject.add("dis_details", MapUtil.listMapToJsonArray(disicdListOfMap));
                        }
                    }

                    // add op data
                    List<Map<String, Object>> opListOfMap = getOPList(map);
                    if (!opListOfMap.isEmpty()) {
                        jsonObject.add("op_details", MapUtil.listMapToJsonArray(opListOfMap));
                    }

                    jsonArray.add(jsonObject);

                }

                jsonObject = MapUtil.getSuccessResult(jsonArray);
            } else {
                jsonObject = MapUtil.getFailureResult("EMRViewList.qetEmrViewListOpdAndInpAndChartNo startDate=" + startDate
                        + " endDate=" + endDate + " chartNo=" + chartNo + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            EMRViewList emrViewList = new EMRViewList(myConnection);

            String startDate = "0010101";
            String endDate = "1061020";
            int chartNo = 912473;

            System.out.println("\nEMRViewList.queryPTListByChartNoDateRange  chartNo=" + chartNo + " startDate=" + startDate + " endDate=" + endDate + " JsonArray: " +
                    MapUtil.listMapToJsonArray(emrViewList.queryPTListByChartNoDateRange(chartNo, startDate, endDate)));

            chartNo = 200586;
            startDate = "1040711";
            endDate = "1050111";
            System.out.println("\nEMRViewList.getEmrViewListOpdInpByChartNoDateRange chartNo=" + chartNo + " startDate=" + startDate + " endDate=" + endDate + " JsonArray: " +
                    emrViewList.getEmrViewListOpdInpByChartNoDateRange(chartNo, startDate, endDate));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}