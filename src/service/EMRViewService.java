package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateComputeUtil;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2017/10/13.
 */
public class EMRViewService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private Patinp patinp;
    private Patopd patopd;
    private OrRecord orRecord;
    private LabRecord labRecord;
    private XrayReport xrayReport;

    private Map<String, Object> getOpdCountByChartNoDateRange(int chartNo, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = patopd.queryOpdCountByChartNoDateRange(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private Map<String, Object> getInpCountBychartNoDateRange(int chartNo, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = patinp.queryInpCountBychartNoDateRange(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private Map<String, Object> getOrCountBychartNoDateRange(int chartNo, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = orRecord.queryOPCountByChartNoDateRange(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private Map<String, Object> getLabCountBychartNoDateRange(int chartNo, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = labRecord.queryLabCountBychartNoDateRange(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private Map<String, Object> getXrayCountBychartNoDateRange(int chartNo, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = xrayReport.queryXrayCountByChartNoDateRange(chartNo, startDate, endDate);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    public String getChartEMRSummaryByChartNoStartEndDate(int chartNo, String startDate, String endDate) {
        Map<String, Object> result = new LinkedHashMap<>();
        int count = 0;
        try {
            object = getOpdCountByChartNoDateRange(chartNo, startDate, endDate);
            result.put("OPD", castToInt(object.get("count")));

            object = getInpCountBychartNoDateRange(chartNo, startDate, endDate);
            result.put("INP", castToInt(object.get("count")));

            object = getOrCountBychartNoDateRange(chartNo, startDate, endDate);
            result.put("OR", castToInt(object.get("count")));

            object = getLabCountBychartNoDateRange(chartNo, startDate, endDate);
            result.put("LAB", castToInt(object.get("count")));

            object = getXrayCountBychartNoDateRange(chartNo, startDate, endDate);
            result.put("XRAY", castToInt(object.get("count")));

            jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(result));

        } catch (Exception ex) {
            System.out.printf("\nEMRViewService.getChartEMRSummaryByChartNoStartEndDate chartNo:%s startDate:%s endDate:%s errorMessage:%s", chartNo, startDate, endDate, ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getChartEMRSummaryByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());
        return getChartEMRSummaryByChartNoStartEndDate(chartNo, startDate, endDate);
    }

    public String getChartEMRSummaryByChartNoAndYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());
        return getChartEMRSummaryByChartNoStartEndDate(chartNo, startDate, endDate);
    }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;

        try {
            myConnection = jdbcUtil.getConnection();

            patopd = new Patopd(myConnection);
            patinp = new Patinp(myConnection);
            orRecord = new OrRecord(myConnection);
            labRecord = new LabRecord(myConnection);
            xrayReport = new XrayReport(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            Long sessionID = parametersJsObj.get("sessionID").getAsLong();
            String method = parametersJsObj.get("method").getAsString();

            //  get EMR View Summary by chartNo
            if (method.equals("getChartEMRSummaryByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getChartEMRSummaryByChartNo(chartNo);
            }

            //  get EMR View Summary by chartNo and years
            if (method.equals("getChartEMRSummaryByChartNoAndYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getChartEMRSummaryByChartNoAndYears(chartNo, years);
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
        EMRViewService emrViewService = new EMRViewService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);

        jsonObject.addProperty("method", "getChartEMRSummaryByChartNo");
        resultStrng = emrViewService.run(jsonObject);
        System.out.printf("\nParameters JsonObject string: %s \n", jsonObject.toString());
        System.out.printf("\nEMRViewService.run getChartEMRSummaryByChartNo chartNo=%d : %s \n", 912473, resultStrng);

        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("method", "getChartEMRSummaryByChartNoAndYears");
        resultStrng = emrViewService.run(jsonObject);
        System.out.printf("\nParameters JsonObject string: %s \n", jsonObject.toString());
        System.out.printf("\nEMRViewService.run getChartEMRSummaryByChartNoAndYears chartNo=%d years=%d : %s \n", 912473, 5, resultStrng);

    }
}

