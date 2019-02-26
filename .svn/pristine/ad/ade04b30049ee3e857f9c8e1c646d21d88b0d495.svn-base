package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Syspara;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2017/10/11.
 */
public class SysparaService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Syspara syspara;

    public String getHospName() {
        try {
            object = syspara.querySysparaByNo("HOSPNAME");

            if (object.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("Syspara.querySysparaByNo no='HOSPNAME' No Data Found ");
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
            syspara = new Syspara(myConnection);
            String method = parametersJsObj.get("method").getAsString();

            //  get hosp name
            if (method.equals("getHospName")) {
                result = getHospName();
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
        SysparaService sysparaService = new SysparaService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("method", "getHospName");
        resultStrng = sysparaService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nsysparaService.run getHospName : " + resultStrng);
    }    
}
