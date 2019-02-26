package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Chgbed;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2018/2/8.
 */
public class ChgbedService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Chgbed chgbed;

    public String getChgbedDataByChartNoSerno(int chartNo, int serno, String roomType) {

        try {
            objects = chgbed.queryChgbedByChartNoSerno(chartNo, serno);

            // if room_type != 'All' then filer data by room_type
            if (!roomType.equals("All")) {
                objects = objects.stream()
                        .filter(map -> castToStr(map.get("room_type")).equals(roomType))
                        .collect(Collectors.toList());
            }

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Chgbed.queryChgbedByChartNoSerno chartNo= " + chartNo +
                        " serno= " + serno + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getChgbedCountByChartNoDateRangeGroupByRoomType(int chartNo, String startDate, String endDate) {
        JsonObject jsob = new JsonObject();
        
        try {
            objects = chgbed.queryChgbedCountByChartNoDateRangeGroupByRoomType(chartNo, startDate, endDate);

            int count = objects.stream()
                    .mapToInt(map -> castToInt(map.get("count")))
                    .sum();

            jsob.addProperty(MapUtil.KEY_SUMMARY, count);
            jsob.add(MapUtil.KEY_DETAILDATA, MapUtil.listMapToJsonArray(objects));
            jsonObject = MapUtil.getSuccessResult(jsob);

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getChgbedListByChartNoDateRange(int chartNo, String startDate, String endDate) {
        try {
            objects = chgbed.queryChgbedListByChartNoDateRange(chartNo, startDate, endDate);

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Chgbed.queryChgbedListByChartNoDateRange chartNo= " + chartNo +
                        " startDate= " + startDate + " endDate= " + endDate + " No Data Found ");
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
            chgbed = new Chgbed(myConnection);
            
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            //  get chgbed data by {chart_no, serno}
            if (method.equals("getChgbedDataByChartNoSerno")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                String roomType = parametersJsObj.get("roomType").getAsString();
                result = getChgbedDataByChartNoSerno(chartNo, serno, roomType);
            }

            // get chgbed count by chart_no, start_date, end_date then group by bed_no // jeffy add
            if (method.equals("getChgbedCountByChartNoDateRangeGroupByRoomType")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getChgbedCountByChartNoDateRangeGroupByRoomType(chartNo, startDate, endDate);
            }

            // get chgbed list by {chart_no, start_date, end_date }
            if (method.equals("getChgbedListByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getChgbedListByChartNoDateRange(chartNo, startDate, endDate);
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
        ChgbedService admissionService = new ChgbedService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 118030);
        jsonObject.addProperty("roomType", "All");
        jsonObject.addProperty("method", "getChgbedDataByChartNoSerno");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nChgbedService.run getChgbedDataByChartNoSerno chartNo=912473 serno=118030 " +
                "roomType='All' :"  + resultStrng);


        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051124");
        jsonObject.addProperty("endDate", "1051206");
        jsonObject.addProperty("method", "getChgbedCountByChartNoDateRangeGroupByRoomType");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nChgbedService.run getChgbedCountByChartNoDateRangeGroupByRoomType chartNo=912473 " +
                " startDate='1051124'" + " endDate='1051206' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("startDate", "1051124");
        jsonObject.addProperty("endDate", "1051206");
        jsonObject.addProperty("method", "getChgbedListByChartNoDateRange");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nChgbedService.run getChgbedListByChartNoDateRange chartNo=912473 " +
                " startDate='1051124'" + " endDate='1051206' :"  + resultStrng);
    }
}
