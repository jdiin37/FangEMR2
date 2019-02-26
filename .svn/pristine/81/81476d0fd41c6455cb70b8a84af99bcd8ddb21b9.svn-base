package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;

import model.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;


/**
 * Created by jeffy on 2017/10/26.
 */
public class EMRViewListService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private EMRViewList emrViewList;

    public String getEmrViewListByYearsChartNo(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return emrViewList.getEmrViewListOpdInpByChartNoDateRange(chartNo, startDate, endDate);
    }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;
        try {
            myConnection = jdbcUtil.getConnection();
            emrViewList = new EMRViewList(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            //  get opd and inp patient list
            if (method.equals("getEmrViewListByYearsChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();

                result = getEmrViewListByYearsChartNo(chartNo, years);
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
        EMRViewListService emrViewListService = new EMRViewListService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);

        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getEmrViewListByYearsChartNo");
        resultStrng = emrViewListService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nInvService.run getEmrViewListByYearsChartNo chartNo=912473 years=5: " + resultStrng);

    }
}

