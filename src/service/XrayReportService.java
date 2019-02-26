package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;
import model.Patopd;
import model.XrayReport;
import model.Xrayord;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2017/11/1.
 */
public class XrayReportService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private XrayReport xrayReport;
    private Xrayord xrayord;
    private Patopd patopd;

    private Map<String, Object> getFirstAndLastViewDateByChartNo(int chartNo) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = patopd.queryFirstAndLastViewDateByChartNo(chartNo);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    public String getXrayCountByChartNoDateRangeVisitTypeGroupByType(int chartNo, String startDate, String endDate, String visitType) {
        JsonObject jsob = new JsonObject();
        List<Map<String, Object>> mapList = new ArrayList<>();
        try {
            objects = xrayReport.queryXrayCountByChartNoDateRangeGroupByType(chartNo, startDate, endDate);

            // filter data for inpatient
            if ("INP".equals(visitType)) {
                mapList = objects.stream()
                        .filter(map -> "I".equals(castToStr(map.get("inp_opd"))))
                        .collect(Collectors.toList());
            }

            // filter data for outpatient
            if ("OPD".equals(visitType)) {
                mapList = objects.stream()
                        .filter(map -> "O".equals(castToStr(map.get("inp_opd"))))
                        .collect(Collectors.toList());
            }

            if ("ALL".equals(visitType)) {
                mapList = objects;
            }

            // group mapList by cat_type, cat_name
            Map<Map<String, Object>, List<Map<String, Object>>> groupMap =
                    MapGroupingUtil.getGroupingResultMap(mapList,
                            Arrays.asList("cat_type", "cat_name"),
                            Arrays.asList("inp_opd", "count"));

            // add count for group by cat_type, cat_name
            int count = 0;
            for (Map.Entry<Map<String, Object>, List<Map<String, Object>>> entry: groupMap.entrySet()) {
                count = entry.getValue().stream().mapToInt(map -> castToInt(map.get("count"))).sum();
                entry.getKey().put("count", count);
            }

            // get grouping data
            List<Map<String, Object>> resultList = new ArrayList<>();
            groupMap.forEach((key, value) -> resultList.add(key));

            // sort by count desc
            resultList.sort((m1, m2) -> castToInt(m2.get("count")) - castToInt(m1.get("count")));

            int summary = resultList.stream()
                    .mapToInt(map -> castToInt(map.get("count")))
                    .sum();

            jsob.addProperty(MapUtil.KEY_SUMMARY, summary);
            jsob.add(MapUtil.KEY_DETAILDATA, MapUtil.listMapToJsonArray(resultList));
            jsonObject = MapUtil.getSuccessResult(jsob);

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getXrayCountByChartNoYearsVisitTypeGroupByType(int chartNo, int years, String visitType) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getXrayCountByChartNoDateRangeVisitTypeGroupByType(chartNo, startDate, endDate, visitType);
    }

    public String getXrayCountByChartNoVisitTypeGroupByType(int chartNo, String visitType) {
        String startDate = "0010101";
        Map<String, Object> map = getFirstAndLastViewDateByChartNo(chartNo);
        if (!map.isEmpty()) {
            startDate =  castToStr(map.get("first_view_date"));
        }
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getXrayCountByChartNoDateRangeVisitTypeGroupByType(chartNo, startDate, endDate, visitType);
    }

    public String getXrayListByChartNoDateRangeVisitType(int chartNo, String startDate, String endDate, String visitType) {
        List<Map<String, Object>> resultList = new ArrayList<>();
        try {
            objects = xrayReport.queryXrayListByChartNoDateRange(chartNo, startDate, endDate);

            if (!objects.isEmpty()) {
                // filter data for inpatient
                if ("INP".equals(visitType)) {
                    resultList = objects.stream()
                            .filter(map -> "I".equals(castToStr(map.get("inp_opd"))))
                            .collect(Collectors.toList());
                }

                // filter data for outpatient
                if ("OPD".equals(visitType)) {
                    List<String> opdList = Arrays.asList("O", "E");
                    resultList = objects.stream()
                            .filter(map -> opdList.contains(castToStr(map.get("inp_opd"))))
                            .collect(Collectors.toList());
                }

                if ("ALL".equals(visitType)) {
                    resultList = objects;
                }

                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(resultList));
            } else {
                jsonObject = MapUtil.getFailureResult("XrayReport.queryXrayListByChartNoDateRange chart_no= " + chartNo +
                        " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getXrayListByChartNoYearsVisitType(int chartNo, int years, String visitType) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getXrayListByChartNoDateRangeVisitType(chartNo, startDate, endDate, visitType);
    }

    public String getXrayListByChartNoVisitType(int chartNo, String visitType) {
        String startDate = "0010101";
        Map<String, Object> map = getFirstAndLastViewDateByChartNo(chartNo);
        if (!map.isEmpty()) {
            startDate =  castToStr(map.get("first_view_date"));
        }
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getXrayListByChartNoDateRangeVisitType(chartNo, startDate, endDate, visitType);
    }

    public String getXrayReportByPrimaryKeys(String xrayType, String inpOpd, String viewDate, int chartNo, int serno, int seqNo) {
        try {
            object = xrayReport.queryXrayReportByPrimaryKeys(xrayType, inpOpd, viewDate, chartNo, serno, seqNo);

            if (!object.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("XrayReport.queryXrayReportByPrimaryKeys xray_type= " + xrayType +
                        " inp_opd= " + inpOpd + " view_date= " + viewDate + " chart_no= " + chartNo +
                        " serno= " + serno + " seq_no= " + seqNo + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo(String xrayType, String inpOpd, String viewDate, int chartNo, int serno, int seqNo) {
        try {
            objects = xrayord.queryXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo(xrayType, inpOpd, viewDate, chartNo, serno, seqNo);

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Xrayord.queryXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNO " +
                        " xray_type= " + xrayType + " inp_opd= " + inpOpd + " view_date= " + viewDate +
                        " chart_no= " + chartNo + " serno= " + serno + " seq_no= " + seqNo + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;

        try {
            myConnection = jdbcUtil.getConnection();
            xrayReport = new XrayReport(myConnection);
            xrayord = new Xrayord(myConnection);
            patopd = new Patopd(myConnection);
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            //  get xray data by chartNo, startDate, endDate, visitType then group by xray_type
            if (method.equals("getXrayCountByChartNoDateRangeVisitTypeGroupByType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getXrayCountByChartNoDateRangeVisitTypeGroupByType(chartNo, startDate, endDate, visitType);
            }

            //  get xray data by chartNo, years, visitType then group by xary_type
            if (method.equals("getXrayCountByChartNoYearsVisitTypeGroupByType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getXrayCountByChartNoYearsVisitTypeGroupByType(chartNo, years, visitType);
            }

            //  get xray data by chartNo, visitType then group by xary_type
            if (method.equals("getXrayCountByChartNoVisitTypeGroupByType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getXrayCountByChartNoVisitTypeGroupByType(chartNo, visitType);
            }

            //  get xray data by chartNo, startDate, endDate, visitType
            if (method.equals("getXrayListByChartNoDateRangeVisitType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getXrayListByChartNoDateRangeVisitType(chartNo, startDate, endDate, visitType);
            }

            //  get xray data by chartNo, years, visitType
            if (method.equals("getXrayListByChartNoYearsVisitType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getXrayListByChartNoYearsVisitType(chartNo, years, visitType);
            }

            //  get xray data by chart_no, visitType
            if (method.equals("getXrayListByChartNoVisitType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getXrayListByChartNoVisitType(chartNo, visitType);
            }

            // get xray report by primary keys => xray_type, inp_opd, view_date, chart_no, serno, seq_no
            if (method.equals("getXrayReportByPrimaryKeys")) {
                String xrayType = parametersJsObj.get("xrayType").getAsString();
                String inpOpd = parametersJsObj.get("inpOpd").getAsString();
                String viewDate = parametersJsObj.get("viewDate").getAsString();
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                int seqNo = parametersJsObj.get("seqNo").getAsInt();
                result = getXrayReportByPrimaryKeys(xrayType, inpOpd, viewDate, chartNo, serno, seqNo);
            }


            // get xrayord by xray_type, inp_opd, view_date, chart_no, serno, seq_no
            if (method.equals("getXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo")) {
                String xrayType = parametersJsObj.get("xrayType").getAsString();
                String inpOpd = parametersJsObj.get("inpOpd").getAsString();
                String viewDate = parametersJsObj.get("viewDate").getAsString();
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                int seqNo = parametersJsObj.get("seqNo").getAsInt();
                result = getXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo(xrayType, inpOpd, viewDate, chartNo, serno, seqNo);
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
        XrayReportService xrayReportService = new XrayReportService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051124");
        jsonObject.addProperty("endDate", "1051206");
        jsonObject.addProperty("visitType", "INP");
        jsonObject.addProperty("method", "getXrayCountByChartNoDateRangeVisitTypeGroupByType");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayCountByChartNoDateRangeVisitTypeGroupByType chartNo=912473 startDate='1051124' endDate='1051206' visitType='INP' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getXrayCountByChartNoYearsVisitTypeGroupByType");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayCountByChartNoYearsVisitTypeGroupByType chartNo=912473 years=5 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getXrayCountByChartNoVisitTypeGroupByType");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayCountByChartNoVisitTypeGroupByType chartNo=912473 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051124");
        jsonObject.addProperty("endDate", "1051206");
        jsonObject.addProperty("visitType", "INP");
        jsonObject.addProperty("method", "getXrayListByChartNoDateRangeVisitType");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayListByChartNoDateRangeVisitType chartNo=912473 startDate='1051124' endDate='1051206' visitType='INP' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getXrayListByChartNoYearsVisitType");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayListByChartNoYearsVisitType chartNo=912473 years=5 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getXrayListByChartNoVisitType");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayListByChartNoVisitType chartNo=912473 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("xrayType", "FG01");
        jsonObject.addProperty("inpOpd", "I");
        jsonObject.addProperty("viewDate", "1030505");
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 94771);
        jsonObject.addProperty("seqNo", 1);
        jsonObject.addProperty("method", "getXrayReportByPrimaryKeys");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayReportByPrimaryKeys xrayType='FG01' inpOpd='I' viewDate='10350505' " +
                "chartNo=912473 serno=94771 seqNo=1 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("xrayType", "XY01");
        jsonObject.addProperty("inpOpd", "I");
        jsonObject.addProperty("viewDate", "1030505");
        jsonObject.addProperty("chartNo", 3461);
        jsonObject.addProperty("serno", 94405);
        jsonObject.addProperty("seqNo", 1370023);
        jsonObject.addProperty("method", "getXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo");
        resultStrng = xrayReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nXrayReportService.run getXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo " +
                "xrayType='XY01' inpOpd='I' viewDate='10350505' chartNo=3461 serno=94405 seqNo=1370023 :"  + resultStrng);

    }
}
