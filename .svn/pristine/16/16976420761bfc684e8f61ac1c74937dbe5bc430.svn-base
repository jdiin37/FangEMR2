package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapEntryUtil;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;
import model.LabRecord;
import model.Patopd;
import model.PatopdEX;
import model.XrayReport;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2018/3/14.
 */
public class PatopdService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Patopd patopd;
    private PatopdEX patopdEX;
    private XrayReport xrayReport;
    private LabRecord labRecord;

    private List<Map<String, Object>> getOpdCountByChartNoDateRangeGroupByType(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            result = patopd.queryOpdCountByChartNoDateRangeGroupByType(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }

        return result;
    }

    private List<Map<String, Object>> getXrayCountByChartNoDateRangeGroupByVCD(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> resultMapList = new ArrayList<>();
        List<Map<String, Object>> xrayMapList;
        try {
            objects = xrayReport.queryXrayListByChartNoDateRange(chartNo, startDate, endDate);

            // filter inp_opd == 'O' -> 門診
            xrayMapList = objects.stream()
                    .filter(innerMap -> "O".equals(castToStr(innerMap.get("inp_opd"))))
                    .collect(Collectors.toList());

            if (!xrayMapList.isEmpty()) {
                List<String> masterCols = Arrays.asList("view_date", "chart_no", "serno");
                List<String> detailCols = Arrays.asList("xray_type", "inp_opd", "seq_no", "form_name", "cat_type", "cat_name", "access_no");
                Map<Map<String, Object>, List<Map<String, Object>>> groupMapList = MapGroupingUtil.getGroupingResultMap(xrayMapList, masterCols, detailCols);

                for (Map.Entry<Map<String, Object>, List<Map<String, Object>>> entry : groupMapList.entrySet()) {
                    entry.getKey().put("count", entry.getValue().size());
                    resultMapList.add(entry.getKey());
                }
            }
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }

        return  resultMapList;
    }

    private List<Map<String, Object>> getLabCountByChartNoDateRangeGroupByVCD(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> resultMapList = new ArrayList<>();
        List<Map<String, Object>> labMapList;
        try {
            objects = labRecord.queryLabListByChartNoDateRange(chartNo, startDate, endDate);
            // filter pt_source != 'I' -> 門診 : O, E
            labMapList = objects.stream()
                    .filter(innerMap -> !castToStr(innerMap.get("pt_source")).equals("I"))
                    .collect(Collectors.toList());

            if (!labMapList.isEmpty()) {
                // change lab_date from AD Date format -> ROC Date format ex. '20161215' -> '1051215'
                for (Map<String, Object> map : labMapList) {
                    map.put("lab_date", DateUtil.adDateStringToROCDateString(castToStr(map.get("lab_date"))));
                    map.put("req_date", DateUtil.adDateStringToROCDateString(castToStr(map.get("req_date"))));
                }

                List<String> masterCols = Arrays.asList("req_date", "chart_no", "serno"); // 已開單日期對應VCD
                List<String> detailCols = Arrays.asList("lab_reportno", "lab_date", "germ_group", "rpt_type", "pt_source", "kind_id", "kind_flag", "kind_name", "report_subtitle");
                Map<Map<String, Object>, List<Map<String, Object>>> groupMapList = MapGroupingUtil.getGroupingResultMap(labMapList, masterCols, detailCols);

                for (Map.Entry<Map<String, Object>, List<Map<String, Object>>> entry : groupMapList.entrySet()) {
                    entry.getKey().put("count", entry.getValue().size());
                    resultMapList.add(entry.getKey());
                }
            }
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }

        return  resultMapList;
    }

    public List<Map<String, Object>> getOpdMainDisCountByChartNoDateRangeCashTypeGroupByDis(int chartNo, String startDate, String endDate, String cashType) {

        List<Map<String, Object>> resultMapList = new ArrayList<>();
        List<Map<String, Object>> opdDisMapList;
        try {
            opdDisMapList = patopdEX.queryOpdDisListByChartNoDateRange(chartNo, startDate, endDate);

            if (!opdDisMapList.isEmpty()) {
                List<Map<String, Object>> opdMainDisMapList = new ArrayList<>();

                // convert cash_type = 'E' -> 'EMG' else -> 'OPD'
                if (cashType.equalsIgnoreCase("ALL")) {
                    opdDisMapList.forEach(map -> map.computeIfPresent("cash_type", (k, v) -> "ALL"));
                } else {
                    opdDisMapList.forEach(map -> map.computeIfPresent("cash_type", (k, v) -> v.equals("E") ? "EMG" : "OPD"));
                }

                // 取得所有主診斷 && 取得欄位 {cash_type, range_no2, range_name_c, range_name_e}
                opdMainDisMapList = opdDisMapList.stream()
                        .filter(map -> castToInt(map.get("rec_count")) == 1) // get main diagnosis
                        .filter(map -> cashType.equalsIgnoreCase("ALL") || castToStr(map.get("cash_type")).equals(cashType))
                        .map(map -> MapEntryUtil.getSubMapByKeyList(map, Arrays.asList("range_no2", "range_name_c", "range_name_e")))
                        .collect(Collectors.toList());

                // convert list to set
                Set<Map<String, Object>> mapSet = new HashSet<>(opdMainDisMapList);

                // add count for each range_no2
                for (Map<String, Object> map : mapSet) {
                    long count = opdMainDisMapList.stream()
                            .filter(disMap -> disMap.get("range_no2").equals(map.get("range_no2")))
                            .count();
                    map.put("count", count);
                }

                // descending sort result by count
                resultMapList.addAll(mapSet);
                resultMapList.sort((map1, map2) -> castToInt(map2.get("count")) - castToInt(map1.get("count")));
            }
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }

        return resultMapList;
    }


    public String getPatopdSummaryByChartNoDateRange(int chartNo, String startDate, String endDate, String cashType) {
        List<Map<String, Object>> result = new ArrayList<>();
        JsonArray jsArray = new JsonArray();
        JsonObject jsObj = new JsonObject();

        List<Map<String, Object>> listMap = getOpdCountByChartNoDateRangeGroupByType(chartNo, startDate, endDate);

        listMap = listMap.stream()
                .filter(map -> cashType.equalsIgnoreCase("ALL") || castToStr(map.get("cash_type")).equals(cashType))
                .map(map -> MapEntryUtil.getSubMapByKeyList(map, Arrays.asList("cash_type", "count")))
                .collect(Collectors.toList());

        int count = listMap.stream()
                .mapToInt(map -> castToInt(map.get("count")))
                .sum();

        jsObj.addProperty(MapUtil.KEY_SUMMARY, count);

        if (!listMap.isEmpty()) {
            jsObj.add("visit_details", MapUtil.listMapToJsonArray(listMap));

            listMap = getOpdMainDisCountByChartNoDateRangeCashTypeGroupByDis(chartNo, startDate, endDate, cashType);
            jsObj.add("dis_details", MapUtil.listMapToJsonArray(listMap));

            jsArray.add(jsObj);

            jsonObject = MapUtil.getSuccessResult(jsObj);
        } else {
            jsonObject = MapUtil.getFailureResult("Patopd.getPatopdSummaryByChartNoDateRange chartNo=" + chartNo
                    + " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
        }

        return jsonObject.toString();
    }

    public String getPatopdSummaryByChartNoYears(int chartNo, int years, String cashType) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getPatopdSummaryByChartNoDateRange(chartNo, startDate, endDate, cashType);
    }

    public String getPatopdSummaryByChartNo(int chartNo, String cashType) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getPatopdSummaryByChartNoDateRange(chartNo, startDate, endDate, cashType);
    }


    public String getPatopdListByChartNoDateRange(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> patopdList = new ArrayList<>();
        List<Map<String, Object>> disMapList = new ArrayList<>();
        Optional<Map<String, Object>> optionalMap;
        Map<String, Object> mainDisMap = new LinkedHashMap<>();

        List<Map<String, Object>> xrayCountList = new ArrayList<>();
        List<Map<String, Object>> labCountList = new ArrayList<>();

        try {
            patopdList = patopd.queryPatopdListByChartNoDateRange(chartNo, startDate, endDate);

            if (!patopdList.isEmpty()) {
                disMapList = patopdEX.queryOpdDisListByChartNoDateRange(chartNo, startDate, endDate);

                xrayCountList = getXrayCountByChartNoDateRangeGroupByVCD(chartNo, startDate, endDate);
                labCountList = getLabCountByChartNoDateRangeGroupByVCD(chartNo, startDate, endDate);

                for (Map<String, Object> map : patopdList) {
                    // start add range_no2, range_name_c, range_name_e of main diagnosis for each patopd record
                    optionalMap = disMapList.stream()
                            .filter(submap -> castToInt(submap.get("rec_count")) == 1)  // get main diagnosis
                            .filter(submap -> submap.get("view_date").equals(map.get("view_date"))
                                    && submap.get("chart_no").equals(map.get("chart_no"))
                                    && submap.get("duplicate_no").equals(map.get("duplicate_no")))
                            .findAny();

                    if (optionalMap.isPresent()) {
                        mainDisMap = MapEntryUtil.getSubMapByKeyList(optionalMap.get(),
                                Arrays.asList("disease_code", "code_name_c", "code_name_e", "range_no2", "range_name_c", "range_name_e"));
                    } else {
                        mainDisMap = MapEntryUtil.createMap(
                                Arrays.asList("disease_code", "code_name_c", "code_name_e", "range_no2", "range_name_c", "range_name_e"),
                                Arrays.asList(null, null, null, null, null, null));
                    }

                    map.putAll(mainDisMap);
                    // end add range_no2, range_name_c, range_name_e of main diagnosis for each patopd record

                    // add xray count for each view_date, chart_no, serno
                    long count = xrayCountList.stream()
                            .filter(submap -> submap.get("view_date").equals(map.get("view_date")))
                            .filter(submap -> submap.get("chart_no").equals(map.get("chart_no")))
                            .filter(submap -> submap.get("serno").equals(map.get("duplicate_no")))
                            .mapToInt(subMap -> castToInt(subMap.get("count")))
                            .sum();

                    if (count != 0) {
                        map.put("XRAY", count);
                    } else {
                        map.put("XRAY", null);
                    }

                    // add lab count for each view_date, chart_no, duplicate_no
                    count = labCountList.stream()
                            .filter(submap -> submap.get("req_date").equals(map.get("view_date")))
                            .filter(submap -> submap.get("chart_no").equals(map.get("chart_no")))
                            .filter(submap -> submap.get("serno").equals(map.get("duplicate_no")))
                            .mapToInt(subMap -> castToInt(subMap.get("count")))
                            .sum();

                    if (count != 0) {
                        map.put("LAB", count);
                    } else {
                        map.put("LAB", null);
                    }
                }

                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(patopdList));
            } else {
                jsonObject = MapUtil.getFailureResult("Patopd.queryPatopdListByChartNoDateRange chartNo=" + chartNo
                        + " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }


    public String getPatopdListByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getPatopdListByChartNoDateRange(chartNo, startDate, endDate);
    }


    public String getPatopdListByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getPatopdListByChartNoDateRange(chartNo, startDate, endDate);
    }


    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;

        try {
            myConnection = jdbcUtil.getConnection();
            patopd = new Patopd(myConnection);
            patopdEX = new PatopdEX(myConnection);
            xrayReport = new XrayReport(myConnection);
            labRecord = new LabRecord(myConnection);
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get patopd emg/opd count and dis_cat count by chartNo, startDate, endDate
            if (method.equals("getPatopdSummaryByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                String cashType = parametersJsObj.get("cashType").getAsString();
                result = getPatopdSummaryByChartNoDateRange(chartNo, startDate, endDate, cashType);
            }

            // get patopd emg/opd count and dis_cat count by chartNo, years
            if (method.equals("getPatopdSummaryByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                String cashType = parametersJsObj.get("cashType").getAsString();
                result = getPatopdSummaryByChartNoYears(chartNo, years, cashType);
            }

            // get patopd emg/opd count and dis_cat count by chartNo
            if (method.equals("getPatopdSummaryByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String cashType = parametersJsObj.get("cashType").getAsString();
                result = getPatopdSummaryByChartNo(chartNo, cashType);
            }


            // get patopd list by chart_no, start_date, end_date
            if (method.equals("getPatopdListByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getPatopdListByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get patopd list by chart_no, years
            if (method.equals("getPatopdListByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getPatopdListByChartNoYears(chartNo, years);
            }

            // get patopd list by chart_no
            if (method.equals("getPatopdListByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getPatopdListByChartNo(chartNo);
            }


        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) { JDBCUtilities.closeConnection(myConnection); }
        }
        return result;
    }


    public static void main(String[] args) {
        JsonObject jsonObject = new JsonObject();
        //Map<String, String> map = new LinkedHashMap<>();
        PatopdService patopdService = new PatopdService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051209");
        jsonObject.addProperty("endDate", "1051213");
        jsonObject.addProperty("cashType", "ALL");
        jsonObject.addProperty("method", "getPatopdSummaryByChartNoDateRange");
//        resultStrng = patopdService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nPatopdService.run getPatopdSummaryByChartNoDateRange chartNo=912473 startDate='1051209' endDate='1051213' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("cashType", "OPD");
        jsonObject.addProperty("method", "getPatopdSummaryByChartNoYears");
//        resultStrng = patopdService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nPatopdService.run getPatopdSummaryByChartNoYears chartNo=912473 years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("cashType", "ALL");
        jsonObject.addProperty("method", "getPatopdSummaryByChartNo");
//        resultStrng = patopdService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nPatopdService.run getPatopdSummaryByChartNo chartNo=912473 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 200586);
        jsonObject.addProperty("startDate", "1020816");
        jsonObject.addProperty("endDate", "1030810");
//        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("startDate", "1051209");
//        jsonObject.addProperty("endDate", "1051213");
        jsonObject.addProperty("method", "getPatopdListByChartNoDateRange");
        resultStrng = patopdService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nPatopdService.run getPatopdListByChartNoDateRange chartNo=912473 startDate='1051209' endDate='1051213' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getPatopdListByChartNoYears");
//        resultStrng = patopdService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nPatopdService.run getPatopdListByChartNoYears chartNo=912473 years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("method", "getPatopdListByChartNo");
//        resultStrng = patopdService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nPatopdService.run getPatopdListByChartNo chartNo=912473 :"  + resultStrng);

    }
}



