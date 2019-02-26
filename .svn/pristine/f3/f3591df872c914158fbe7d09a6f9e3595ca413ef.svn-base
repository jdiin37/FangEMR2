package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Admission;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/2/8.
 */
public class AdmissionService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Admission admission;

    public String getAdmissionListByChartNoSerno(int chartNo, int serno) {
        try {
            objects = admission.queryAdmissionListByChartNoSerno(chartNo, serno);

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("Admission.queryAdmissionListByChartNoSerno chartNo= " + chartNo +
                        " serno= " + serno + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

//    public String getAdmissionDataByPrimaryKeys(int chartNo, int serno, int cutSerno) {
//        try {
//            object = admission.queryAdmissionDataByPrimaryKeys(chartNo, serno, cutSerno);
//
//            if (!object.isEmpty()) {
//                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
//            } else {
//                jsonObject = MapUtil.getFailureResult("Admission.queryAdmissionDataByPrimaryKeys chartNo= " + chartNo +
//                        " serno= " + serno + " cutSerno= " + cutSerno + " No Data Found ");
//            }
//
//        } catch (SQLException ex) {
//            JDBCUtilities.printSQLException(ex);
//            jsonObject = MapUtil.getFailureResult(ex.getMessage());
//        }
//
//        return jsonObject.toString();
//    }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;

        try {
            myConnection = jdbcUtil.getConnection();
            admission = new Admission(myConnection);
            
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get admission list by chart_no, serno
            if (method.equals("getAdmissionListByChartNoSerno")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                result = getAdmissionListByChartNoSerno(chartNo, serno);
            }

            //  get admission data by primary keys => {chart_no, serno, cut_serno}
//            if (method.equals("getAdmissionDataByPrimaryKeys")) {
//                int chartNo = parametersJsObj.get("chartNo").getAsInt();
//                int serno = parametersJsObj.get("serno").getAsInt();
//                int cutSerno = parametersJsObj.get("cutSerno").getAsInt();
//                result = getAdmissionDataByPrimaryKeys(chartNo, serno, cutSerno);
//            }

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
        AdmissionService admissionService = new AdmissionService();
        String resultStrng;

//        jsonObject.addProperty("empNo", "ORCL");
//        jsonObject.addProperty("sessionID", 1);
//        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("serno", 94771);
//        jsonObject.addProperty("cutSerno", 0);
//        jsonObject.addProperty("method", "getAdmissionDataByPrimaryKeys");
//        resultStrng = admissionService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nadmissionService.run getAdmissionDataByPrimaryKeys chartNo=923833 serno=94771 cutSerno=0 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 94771);
        jsonObject.addProperty("method", "getAdmissionListByChartNoSerno");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nadmissionService.run getAdmissionListByChartNoSerno chartNo=923833 serno=94771 :"  + resultStrng);

    }
}
