package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;
import model.Allergy;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/4/20.
 */

public class AllergyService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Allergy allergy;


    public String getAllergyByChartNo(int chartNo) {
        try {
            objects = allergy.queryAllergyByChartNo(chartNo);

            if (!objects.isEmpty()) {
                Map<Map<String, Object>, List<Map<String, Object>>> groupMap =
                        MapGroupingUtil.getGroupingResultMap(objects, Arrays.asList("chart_no", "allergy"), Arrays.asList("const_kind", "kind_name", "code", "full_name"));

                jsonObject = MapUtil.getSuccessResult(MapGroupingUtil.groupListMapToJsonArray(groupMap));
            } else {
                jsonObject = MapUtil.getFailureResult("Allergy.queryAllergyByChartNo No Data Found ");
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
            allergy = new Allergy(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get allergy by chartNo
            if (method.equals("getAllergyByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getAllergyByChartNo(chartNo);
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
        AllergyService allergyService = new AllergyService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 940219);
        jsonObject.addProperty("method", "getAllergyByChartNo");
        resultStrng = allergyService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nAllergyService.run getAllergyByChartNo :"  + resultStrng);

    }
}

