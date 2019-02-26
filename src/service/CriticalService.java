package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapEntryUtil;
import library.utility.MapUtil;
import model.Critical;
import model.Disicd;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2018/4/19.
 */

public class CriticalService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Critical critical;
    private Disicd disicd;


    public String getCriticalByChartNo(int chartNo) {
        JsonObject jsObj = new JsonObject();
        try {
            objects = critical.queryCriticalByChartNo(chartNo);

            if (!objects.isEmpty()) {

                // add disicd data -> code, title1, title2, he_code, is_detail
                for (Map<String, Object> map : objects) {
                    object = disicd.queryDisicdByCode(castToStr(map.get("ill_icd9")));
                    if (!object.isEmpty()) {
                        map.putAll(object);
                    } else {
                        Map<String, Object> nullMap = MapEntryUtil.createMap(
                                Arrays.asList("code", "title1", "title2", "he_code", "is_detail"),
                                Arrays.asList(null, null, null, null, null));
                        map.putAll(nullMap);
                    }
                }

                int summary = objects.stream()
                        .mapToInt(map -> 1)
                        .sum();
                
                jsObj.addProperty(MapUtil.KEY_SUMMARY, summary); // add summary

                jsObj.add("critical_details", MapUtil.listMapToJsonArray(objects)); // add critical detail data
                
                jsonObject = MapUtil.getSuccessResult(jsObj);
            } else {
                jsonObject = MapUtil.getFailureResult("Critical.queryCriticalByChartNo No Data Found ");
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
            critical = new Critical(myConnection);
            disicd = new Disicd(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get critical by chartNo
            if (method.equals("getCriticalByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getCriticalByChartNo(chartNo);
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
        CriticalService criticalService = new CriticalService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 281678);
        jsonObject.addProperty("method", "getCriticalByChartNo");
        resultStrng = criticalService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nCriticalService.run getCriticalByChartNo :"  + resultStrng);

    }
}

