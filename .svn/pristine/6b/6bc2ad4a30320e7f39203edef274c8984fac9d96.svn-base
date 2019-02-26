package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.PadLogonRec;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;


/**
 * Created by jeffy on 2017/3/31.
 */
public class PadLogonService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    PadLogonRec padLogonRec;

    public String countPadLogonRec(String idNo, Long sessionID) {
        try {
            object = padLogonRec.countPadLogonRec(idNo, sessionID);

            if (object.size() > 0) {
                jsonObject = MapUtil.mapToJsonObject(object);
//                jsonObject.addProperty("status", "Success");
            } else {
                jsonObject = MapUtil.getFailureResult("PadLogonRec.countPadLogonRec idNo= " + idNo + " sessionID= " + sessionID + " No Data Found ");
            }
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }
        return jsonObject.toString();
    }

    public String updateLogonSession(String idNo, Long sessionID) {
        try {
            object = padLogonRec.updatePadLogonRec(idNo, sessionID);
            if (object.size() > 0) {
                jsonObject = MapUtil.mapToJsonObject(object);
//                jsonObject.addProperty("status", "Success");
            } else {
                jsonObject = MapUtil.getFailureResult("PadLogonRec.updatePadLogonRec idNo= " + idNo + " sessionID= " + sessionID + " No Data Found ");
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
            padLogonRec = new PadLogonRec(myConnection);
            String method = parametersJsObj.get("method").getAsString();
            String idNo = parametersJsObj.get("idNo").getAsString();
            long sessionID = parametersJsObj.get("sessionID").getAsLong();

            if (method.equals("countPadLogonRec")) {
                result = countPadLogonRec(idNo, sessionID);
            }

            if (method.equals("updateLogonSession")) {
                result = updateLogonSession(idNo, sessionID);
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }

        return result;
    }

    public static void main(String[] args) {
        JsonObject jsonObject = new JsonObject();
        //Map<String, String> parameterMap = new LinkedHashMap<>();
        PadLogonService padLogonService = new PadLogonService();
        String results;

        jsonObject.addProperty("idNo", "ORCL");
        jsonObject.addProperty("sessionID", 1806);

        jsonObject.addProperty("method", "countPadLogonRec");
        results = padLogonService.run(jsonObject);
        System.out.println("PadLogonService.countPadLogonRec: " + results);

        jsonObject.addProperty("method", "updateLogonSession");
        results = padLogonService.run(jsonObject);
        System.out.println("PadLogonService.updateLogonSession: " + results);
    }
}
