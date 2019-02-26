package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import library.dateutility.DateComputeUtil;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;
import library.utility.MatrixUtil;
import model.Chart;
import model.LabRecord;
import model.Patopd;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static library.utility.MapUtil.*;

/**
 * Created by jeffy on 2017/10/30.
 */
public class LabRecordService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private LabRecord labRecord;
    private Patopd patopd;
    private Chart chart;

    private Map<String, Object> getFirstAndLastViewDateByChartNo(int chartNo) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = patopd.queryFirstAndLastViewDateByChartNo(chartNo);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private String adObjectToRocDateString(Object adDateObj) {
        String result = "";
        if (adDateObj != null) {
            result = DateUtil.adDateStringToROCDateString(castToStr(adDateObj));
        }
        return result;
    }

    private String getRealNormalRange(String birthDate, int sex, String labDate, String normalRange) {
        String realNoramlRange = "";
        int ages = 0;
        ages = DateComputeUtil.getAgesByYear(birthDate, labDate);

        // 將 異常|正常|最小值
        String[] range = normalRange.split("\\|", 3);

        if (ages > 6) {
            realNoramlRange = sex == 1 ? range[0] : range[1];
        } else {
            realNoramlRange = range[2];
        }

        if (range[0].equals("") && range[2].equals("")) realNoramlRange = range[1];

        // replace ' ' -> '' and then '-' -> ' - '
        realNoramlRange = realNoramlRange.replace(" ", "").replace("/", " - ");

        return realNoramlRange;
    }


    public String getLabCountByChartNoDateRangeVisitTypeGroupByKind(int chartNo, String startDate, String endDate, String visitType) {
        JsonObject jsob = new JsonObject();
        List<Map<String, Object>> mapList = new ArrayList<>();
        try {
            objects = labRecord.queryLabCountByChartNoDateRangeGroupByKind(chartNo, startDate, endDate);

            // filter data for inpatient
            if ("INP".equals(visitType)) {
                mapList = objects.stream()
                        .filter(map -> "I".equals(castToStr(map.get("pt_source"))))
                        .collect(Collectors.toList());
            }

            // filter data for outpatient
            if ("OPD".equals(visitType)) {
                List<String> opdList = Arrays.asList("O","E");
                mapList = objects.stream()
                        .filter(map -> opdList.contains(castToStr(map.get("pt_source"))))
                        .collect(Collectors.toList());
            }

            if ("ALL".equals(visitType)) {
                mapList = objects;
            }

            // group mapList by kind_id, kind_name, report_subtitle
            Map<Map<String, Object>, List<Map<String, Object>>> groupMap =
                    MapGroupingUtil.getGroupingResultMap(mapList,
                    Arrays.asList("kind_id", "kind_name", "report_subtitle"),
                    Arrays.asList("pt_source", "count"));

            // add count for group by pt_source, kind_id, kind_name, report_subtitle
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

    public String getLabCountByChartNoYearsVisitTypeGroupByKind(int chartNo, int years, String visitType) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getLabCountByChartNoDateRangeVisitTypeGroupByKind(chartNo, startDate, endDate, visitType);
    }

    public String getLabCountByChartNoVisitTypeGroupByKind(int chartNo, String visitType) {
        String startDate = "0010101";
        Map<String, Object> map = getFirstAndLastViewDateByChartNo(chartNo);
        if (!map.isEmpty()) {
            startDate =  castToStr(map.get("first_view_date"));
        }
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());
        return getLabCountByChartNoDateRangeVisitTypeGroupByKind(chartNo, startDate, endDate, visitType);
    }

    public String getLabListByChartNoDateRangeVisitType(int chartNo, String startDate, String endDate, String visitType) {
        List<Map<String, Object>> resultList = new ArrayList<>();
        try {
            objects = labRecord.queryLabListByChartNoDateRange(chartNo, startDate, endDate);

            if (!objects.isEmpty()) {
                // filter data for inpatient
                if ("INP".equals(visitType)) {
                    resultList = objects.stream()
                            .filter(map -> "I".equals(castToStr(map.get("pt_source"))))
                            .collect(Collectors.toList());
                }

                // filter data for outpatient
                if ("OPD".equals(visitType)) {
                    List<String> opdList = Arrays.asList("O","E");
                    resultList = objects.stream()
                            .filter(map -> opdList.contains(castToStr(map.get("pt_source"))))
                            .collect(Collectors.toList());
                }

                if ("ALL".equals(visitType)) {
                    resultList = objects;
                }

                for (Map<String, Object> map : resultList) {
                    map.put("years", adObjectToRocDateString(map.get("lab_date")).substring(0, 3));
                    map.put("lab_date", adObjectToRocDateString(map.get("lab_date")));
                    map.put("req_date", adObjectToRocDateString(map.get("req_date")));
                }

                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(resultList));
            } else {
                jsonObject = MapUtil.getFailureResult("LabRecord.queryLabListByChartNoDateRange chart_no= " + chartNo +
                        " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getLabListByChartNoYearsVisitType(int chartNo, int years, String visitType) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getLabListByChartNoDateRangeVisitType(chartNo, startDate, endDate, visitType);
    }

    public String getLabListByChartNoVisitType(int chartNo, String visitType) {
        String startDate = "0010101";
        Map<String, Object> map = getFirstAndLastViewDateByChartNo(chartNo);
        if (!map.isEmpty()) {
            startDate =  castToStr(map.get("first_view_date"));
        }
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getLabListByChartNoDateRangeVisitType(chartNo, startDate, endDate, visitType);
    }

    public String getMatrixLabDdataByChartNoLabTypeLabItemsAndRange(int chartNo, String kindId, String range, String labItems) {

        Map<String, Object> chartMap = new LinkedHashMap<>();
        List<Map<String, Object>> matrixObjects;
        List<Map<String, Object>> resultObjects;
        JsonArray jsonArray;

        // get start_date and end_date from range
        List<String> dateList = DateComputeUtil.getStartDateEndDate(range);
        String startDate = dateList.get(0);
        String endDate = dateList.get(1);

        try {
            objects = labRecord.queryLabDdataByChartNoLabTypeLabItemsAndRange(chartNo, kindId, startDate, endDate, labItems);
            object = chart.queryChartByChartNo(chartNo);

            String normalRange = "";
            String labDate = "";

            if (objects.size() > 0) {
                String birthDate = castToStr(object.get("birth_date"));
                int sex = castToInt(object.get("sex"));

                for (Map<String, Object> map : objects) {
                    labDate = adObjectToRocDateString(map.get("lab_date"));
                    // convert lab_date form AD DateString to ROC DateString
                    map.put("lab_date", labDate);

                    // add real_normal_range result by normal_range & age & sex
                    normalRange = castToStr(map.get("normal_range"));
                    map.put("real_normal_range", emptyToNull(getRealNormalRange(birthDate, sex, labDate, normalRange)));
                }

                // Create Matrix Object => Define xAxialName, yAxialName cellName
                String xAxialName = "assay_id";
                String yAxialName = "lab_date";
                String cellName = "result_val";
                MatrixUtil matrixUtil = new MatrixUtil(objects, xAxialName, yAxialName, cellName);
                matrixObjects = matrixUtil.getMatrixObjects();
                //System.out.println("\nmatrixObjects:" + listMapToJsonArray(matrixObjects));

                // Merge other cols from source 'objects' to target 'matrixObjects'
                List<String> keyListToAdd = Arrays.asList("chart_no", "lab_reportno", "duplicate_no", "unit",
                        "normal_range", "report_normalrange", "real_normal_range", "kind_id", "kind_name", "kind_flag", "assay_judgetype", "lab_status",
                        "result_kind", "result_status", "lab_status");
                List<String> criteriaKeys = Arrays.asList("assay_id");
                resultObjects = matrixUtil.mergeMapFromSourceToTarget(objects, matrixObjects, keyListToAdd, criteriaKeys);
                //System.out.println("\nresultObjects:" + listMapToJsonArray(resultObjects));

                // Convert 'resultObjects' to master-detail shape JsonArray
                List<String> masterCols = Arrays.asList("assay_id", "chart_no", "lab_reportno", "kind_id", "kind_name", "kind_flag");
                List<String> detailCols = Arrays.asList("lab_date", "result_val", "duplicate_no", "unit",
                        "normal_range", "real_normal_range", "report_normalrange", "assay_judgetype",
                        "lab_status", "result_kind", "result_status", "lab_status" );

                jsonArray = MapGroupingUtil.groupListMapToJsonArray(MapGroupingUtil.getGroupingResultMap(resultObjects, masterCols, detailCols));
                //System.out.println("\njsonArray:" + jsonArray);

                jsonObject = MapUtil.getSuccessResult(jsonArray);
            } else {
                jsonObject = MapUtil.getFailureResult("labRecord.queryLabDdataByChartNoLabTypeAndRange chartNo=" + chartNo
                        + " kindId='" + kindId + "' startDate='" + startDate + "' endDate='" + endDate
                        + "' No Data Found ");
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
            labRecord = new LabRecord(myConnection);
            patopd = new Patopd(myConnection);
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get Lab count by chartNo visitType then group by kind_id
            if (method.equals("getLabCountByChartNoVisitTypeGroupByKind")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getLabCountByChartNoVisitTypeGroupByKind(chartNo, visitType);
            }

            //  get Lab count by chartNo, years, visitType then group by kind_id
            if (method.equals("getLabCountByChartNoYearsVisitTypeGroupByKind")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getLabCountByChartNoYearsVisitTypeGroupByKind(chartNo, years, visitType);
            }

            //  get Lab count by chartNo, startDate, endDate visitType then group by kind_id
            if (method.equals("getLabCountByChartNoDateRangeVisitTypeGroupByKind")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getLabCountByChartNoDateRangeVisitTypeGroupByKind(chartNo, startDate, endDate, visitType);
            }

            // get Lab list by chart_no, visitType
            if (method.equals("getLabListByChartNoVisitType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getLabListByChartNoVisitType(chartNo, visitType);
            }

            // get Lab list by chart_no, years, visitType
            if (method.equals("getLabListByChartNoYearsVisitType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getLabListByChartNoYearsVisitType(chartNo, years, visitType);
            }

            // get Lab list by chart_no, startDate, endDate, visitType
            if (method.equals("getLabListByChartNoDateRangeVisitType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                String visitType = parametersJsObj.get("visitType").getAsString();
                result = getLabListByChartNoDateRangeVisitType(chartNo, startDate, endDate, visitType);
            }

            // get Matrix labrecordd data by chart_no, kind_id, range and assay_id
            if (method.equals("getMatrixLabDdataByChartNoLabTypeLabItemsAndRange")) {
                chart = new Chart(myConnection);
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String kindId = parametersJsObj.get("kindId").getAsString();
                String range = parametersJsObj.get("range").getAsString();
                String labItems = parametersJsObj.get("labItems").getAsString();

                result = getMatrixLabDdataByChartNoLabTypeLabItemsAndRange(chartNo, kindId, range, labItems);
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) { JDBCUtilities.closeConnection(myConnection); }
        }
        return result;
    }


    public static void main(String[] args) {

        String temp = "|4.2/4.9|";
        String rangeOne = temp.substring(0, 0);
        String rangeTwo = temp.substring(1, 8);
        String rangeThree = temp.substring(9, 9);

        JsonObject jsonObject = new JsonObject();
        //Map<String, String> map = new LinkedHashMap<>();
        LabRecordService labRecordService = new LabRecordService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getLabCountByChartNoVisitTypeGroupByKind");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getLabCountByChartNoVisitTypeGroupByKind chartNo=923833 visitType='ALL' :"  + resultStrng);


        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getLabCountByChartNoYearsVisitTypeGroupByKind");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getLabCountByChartNoYearsVisitTypeGroupByKind chartNo=923833 years=5 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051209");
        jsonObject.addProperty("endDate", "1051217");
        jsonObject.addProperty("visitType", "INP");
        jsonObject.addProperty("method", "getLabCountByChartNoDateRangeVisitTypeGroupByKind");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getLabCountByChartNoDateRangeVisitTypeGroupByKind chartNo=923833 startDate='0940806' endDate='1030913' visitType='INP' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getLabListByChartNoVisitType");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getLabListByChartNoVisitType chartNo=912473 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("visitType", "ALL");
        jsonObject.addProperty("method", "getLabListByChartNoYearsVisitType");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getLabListByChartNoYearsVisitType chartNo=912473 years=5 visitType='ALL' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051209");
        jsonObject.addProperty("endDate", "1051217");
        jsonObject.addProperty("visitType", "INP");
        jsonObject.addProperty("method", "getLabListByChartNoDateRangeVisitType");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getLabListByChartNoDateRangeVisitType chartNo=923833 startDate='0940806' endDate='1030913' visitType='INP' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("kindId", "A4");
        jsonObject.addProperty("range", "1030101|1051217");
        jsonObject.addProperty("labItems", "Albumin|Alk-p|Amylase|BUN|Blood Crea|Cl");
        jsonObject.addProperty("method", "getMatrixLabDdataByChartNoLabTypeLabItemsAndRange");
        resultStrng = labRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getMatrixLabDdataByChartNoLabTypeLabItemsAndRange chartNo=912473 kineId='A4' " +
                "range='1030101|1051217' labItems='Albumin|Alk-p|Amylase|BUN|Blood Crea|Cl' : "  + resultStrng);

    }
}

