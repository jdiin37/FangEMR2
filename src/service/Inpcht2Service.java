package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Inpcht2;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2018/3/1.
 */
public class Inpcht2Service extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Inpcht2 inpcht2;

    public String getInpcht2StateByChartNoSerno(int chartNo, int serno) {
        List<Map<String, Object>> tempObjects = new ArrayList<>();
        try {
            tempObjects = inpcht2.queryInpcht2ByChartNoSernoOrderType(chartNo, serno, "S");

            objects = tempObjects.stream()
                    .filter(map -> castToStr(map.get("take_home")).equals("N"))
                    .collect(Collectors.toList());

            if (objects.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Inpcht2.queryInpcht2ByChartNoSernoOrderType State " +
                        " chart_no= " + chartNo + " serno= " + serno + " orderType='S' No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getInpcht2TakeHomeByChartNoSerno(int chartNo, int serno) {
        List<Map<String, Object>> tempObjects = new ArrayList<>();
        try {
            tempObjects = inpcht2.queryInpcht2ByChartNoSernoOrderType(chartNo, serno, "S");

            objects = tempObjects.stream()
                    .filter(map -> map.get("take_home").equals("Y"))
                    .collect(Collectors.toList());

            if (objects.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Inpcht2.queryInpcht2ByChartNoSernoOrderType TakeHome  " +
                        " chart_no= " + chartNo + " serno= " + serno + " orderType='S' No Data Found ");
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
            inpcht2 = new Inpcht2(myConnection);
            int chartNo = parametersJsObj.get("chartNo").getAsInt();
            int serno = parametersJsObj.get("serno").getAsInt();
            String method = parametersJsObj.get("method").getAsString();

            // get inpcht2 state by chart_no, serno
            if (method.equals("getInpcht2StateByChartNoSerno")) {
                result = getInpcht2StateByChartNoSerno(chartNo, serno);
            }

            // get inpcht2 take home by chart_no, serno
            if (method.equals("getInpcht2TakeHomeByChartNoSerno")) {
                result = getInpcht2TakeHomeByChartNoSerno(chartNo, serno);
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
        Inpcht2Service inpcht2Service = new Inpcht2Service();
        String resultStrng;

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 94771);
        jsonObject.addProperty("method", "getInpcht2StateByChartNoSerno");
        resultStrng = inpcht2Service.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nInpcht2Service.run getInpcht2StateByChartNoSerno chartNo=912473 serno=94771 :" + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 94771);
        jsonObject.addProperty("method", "getInpcht2TakeHomeByChartNoSerno");
        resultStrng = inpcht2Service.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nInpcht2Service.run getInpcht2TakeHomeByChartNoSerno chartNo=912473 serno=94771 :" + resultStrng);

    }

}
