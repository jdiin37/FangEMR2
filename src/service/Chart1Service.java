package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Chart1;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/4/2.
 */
public class Chart1Service extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Chart1 chart1;

    public String getChart1ByPrimaryKeys(String viewDate, int chartNo, int duplicateNo) {
        Map<String, Object> chart1Map = new LinkedHashMap<>();

        try {
            chart1Map = chart1.queryChart1ByPrimaryKeys(viewDate, chartNo, duplicateNo);

            if (!chart1Map.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(chart1Map));
            } else {
                jsonObject = MapUtil.getFailureResult("Chart1.queryChart1ByPrimaryKeys viewDate='" + viewDate
                        + "' chartNo=" + chartNo + " duplicateNo=" + duplicateNo + " No Data Found ");
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
            chart1 = new Chart1(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get chart1 by viewDate, chartNo, duplicateNo
            if (method.equals("getChart1ByPrimaryKeys")) {
                String viewDate = parametersJsObj.get("viewDate").getAsString();
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int duplicateNo = parametersJsObj.get("duplicateNo").getAsInt();
                result = getChart1ByPrimaryKeys(viewDate, chartNo, duplicateNo);
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
        Chart1Service chart1Service = new Chart1Service();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("viewDate", "1051209");
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("duplicateNo", 1);
        jsonObject.addProperty("method", "getChart1ByPrimaryKeys");
        resultStrng = chart1Service.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nChart1Service.run getChart1ByPrimaryKeys viewDate='1051209' chartNo=912473 duplicateNo=1 :"  + resultStrng);

    }
}



