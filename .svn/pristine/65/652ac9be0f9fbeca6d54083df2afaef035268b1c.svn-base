package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapEntryUtil;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;
import model.Patopd;
import model.PatopdEX;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static library.utility.MapUtil.*;

/**
 * Created by jeffy on 2018/3/14.
 */
public class PatopdDisService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Patopd patopd;
    private PatopdEX patopdEX;


    public String getOpdDisSummaryByChartNoDateRange(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> disMapList;
        List<Map<String, Object>> patopdList;
        Optional<Map<String, Object>> optionalMap;        

        try {

            // 取得某病歷號 & 起始日期內 所有診斷碼相關資料
            disMapList = patopdEX.queryOpdDisListByChartNoDateRange(chartNo, startDate, endDate);            

            if (!disMapList.isEmpty()) {
                // 依據 disease_code, code_name_c, code_name_e 分群
                List<String> masterCols = Arrays.asList("disease_code", "code_name_c", "code_name_e");
                List<String> detailCols = Arrays.asList("view_date", "chart_no", "duplicate_no");
                Map<Map<String, Object>, List<Map<String, Object>>> groupingMapList =
                        MapGroupingUtil.getGroupingResultMap(disMapList, masterCols, detailCols);
                
                // 取得某病歷號 & 起始日期內 所有門診相關資料
                patopdList = patopd.queryPatopdListByChartNoDateRange(chartNo, startDate, endDate);

                Map<String, Object> keyMap;
                List<Map<String, Object>> valueList;
                
                for (Map.Entry<Map<String, Object>, List<Map<String, Object>>> entry : groupingMapList.entrySet()) {
                    keyMap = entry.getKey();
                    valueList = entry.getValue();
                    keyMap.put("summary", valueList.size()); // add summary by counting valueList

                    for (Map<String, Object> map : valueList) {
                        // get Map from patopdList by filtering view_date, chart_no, duplicate_no
                        optionalMap = patopdList.stream()
                                .filter(submap -> (
                                        castToStr(submap.get("view_date")).equals(castToStr(map.get("view_date"))))
                                        && (castToInt(submap.get("chart_no")) == (castToInt(map.get("chart_no"))))
                                        && (castToInt(submap.get("duplicate_no")) == (castToInt(map.get("duplicate_no")))))
                                .findAny();

                        // add doctor_no, doctor_name, div_no, div_name, cash_type, cash_type to each map
                        optionalMap.ifPresent(optMap ->
                                map.putAll(MapEntryUtil.getSubMapByKeyList(optMap,
                                        Arrays.asList("doctor_no", "doctor_name", "div_no", "div_name", "cash_type", "cash_type_name"))));
                    }
                }
                jsonObject = MapUtil.getSuccessResult(MapGroupingUtil.groupListMapToJsonArray(groupingMapList));
            } else {
                jsonObject = MapUtil.getFailureResult("PatopdEX.queryOpdDisListByChartNoDateRange chartNo=" + chartNo
                        + " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }


    public String getOpdDisSummaryByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getOpdDisSummaryByChartNoDateRange(chartNo, startDate, endDate);
    }


    public String getOpdDisSummaryByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getOpdDisSummaryByChartNoDateRange(chartNo, startDate, endDate);
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
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get patopd emg/opd count and dis_cat count by chartNo, startDate, endDate
            if (method.equals("getOpdDisSummaryByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getOpdDisSummaryByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get patopd emg/opd count and dis_cat count by chartNo, years
            if (method.equals("getOpdDisSummaryByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getOpdDisSummaryByChartNoYears(chartNo, years);
            }

            // get patopd emg/opd count and dis_cat count by chartNo
            if (method.equals("getOpdDisSummaryByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getOpdDisSummaryByChartNo(chartNo);
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
        PatopdDisService patopdDisService = new PatopdDisService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("startDate", "1051209");
//        jsonObject.addProperty("endDate", "1051213");
        jsonObject.addProperty("startDate", "1050620");
        jsonObject.addProperty("endDate", "1050921");
        jsonObject.addProperty("method", "getOpdDisSummaryByChartNoDateRange");
        resultStrng = patopdDisService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nPatopdDisService.run getOpdDisSummaryByChartNoDateRange chartNo=912473 startDate='1021031' endDate='1060504' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getOpdDisSummaryByChartNoYears");
        resultStrng = patopdDisService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nPatopdDisService.run getOpdDisSummaryByChartNoYears chartNo=912473 years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("method", "getOpdDisSummaryByChartNo");
        resultStrng = patopdDisService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nPatopdDisService.run getOpdDisSummaryByChartNo chartNo=912473 :"  + resultStrng);

    }
}



