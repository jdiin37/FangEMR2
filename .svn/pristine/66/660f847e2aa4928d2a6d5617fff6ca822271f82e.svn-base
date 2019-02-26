package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Udd2;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/3/1.
 */
public class Udd2Service extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Udd2 udd2;

    public String getUdd2ByChartNoSerno(int chartNo, int serno) {
        try {
            objects = udd2.queryUdd2ByChartNoSerno(chartNo, serno);

            if (objects.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Udd2.queryUdd2ByChartNoSerno " +
                        " chart_no= " + chartNo + " serno= " + serno + " No Data Found ");
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
            udd2 = new Udd2(myConnection);
            int chartNo = parametersJsObj.get("chartNo").getAsInt();
            int serno = parametersJsObj.get("serno").getAsInt();
            String method = parametersJsObj.get("method").getAsString();

            //  get udd2 by chart_no, serno
            if (method.equals("getUdd2ByChartNoSerno")) {
                result = getUdd2ByChartNoSerno(chartNo, serno);
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
        Udd2Service inpcht2Service = new Udd2Service();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 94771);
        jsonObject.addProperty("method", "getUdd2ByChartNoSerno");
        resultStrng = inpcht2Service.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nUdd2Service.run getUdd2ByChartNoSerno chartNo=912473 serno=94771 :" + resultStrng);

    }

}
