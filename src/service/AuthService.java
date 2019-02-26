package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.PadLogonRec;
import model.Employee;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2017/7/28.
 */
public class AuthService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Employee employee;
    private PadLogonRec padLogonRec;


    public String checkPasswd(String empNo, String passwd) {

        if (empNo == null) {
            jsonObject = MapUtil.getFailureResult("emp_no must not null");
            return jsonObject.toString();
        }
        if (empNo.trim().equals("")) {
            jsonObject = MapUtil.getFailureResult("emp_no must not empty string");
            return jsonObject.toString();
        }
        if (passwd == null) {
            jsonObject = MapUtil.getFailureResult("password must not null");
            return jsonObject.toString();
        }

        if (passwd.trim().equals("")) {
            jsonObject = MapUtil.getFailureResult("password must not empty string");
            return jsonObject.toString();
        }

        // Check user password is matched
        try {
            object = employee.queryEmployeeByEmpNo(empNo);
            if (object.size() > 0) {
                if (((String) object.get("passwd")).toUpperCase().equals(passwd.toUpperCase())) {
                    jsonObject.addProperty("status", "Success");
                    jsonObject.addProperty("emp_no", (String) object.get("emp_no"));
                    jsonObject.addProperty("emp_name", (String) object.get("emp_name"));

                } else {
                    jsonObject = MapUtil.getFailureResult("password is not match");
                }
            } else {
                jsonObject = MapUtil.getFailureResult("No such emp_no !!!");
            }

            if (jsonObject.get("status").getAsString().equals("Success")) {
                object = padLogonRec.insertPadLogonRec((String) object.get("emp_no"));
                if (object.get("status").equals("Success")) {
                    jsonObject.addProperty("session_id", (Number)object.get("session_id"));
                }
            }
        } catch (Exception ex) {
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
            employee = new Employee(myConnection);
            padLogonRec = new PadLogonRec(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            String passwd = parametersJsObj.get("password").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // check emp no and password
            if (method.equals("checkPasswd")) {
                result = checkPasswd(empNo, passwd);
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
        AuthService authService = new AuthService();
        String resultStrng;

//        jsonObject.addProperty("idNo", "ORCL");
//        jsonObject.addProperty("password", "HAKKA72574");
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("password", "UNIMAXORCL");
        jsonObject.addProperty("method", "checkPasswd");
        System.out.println("\nParameters JsonObject string: " + jsonObject);

        resultStrng = authService.run(jsonObject);
        System.out.println("\nAuthService.run checkPasswd: " + resultStrng);
    }
}
