package model;

import library.dateutility.DateUtil;
import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Created by jeffy on 2017/10/31.
 */
public class XrayReport {
    private Connection con;

    public XrayReport(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryXrayCountByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        List<Map<String, Object>> objects;
        Map<String, Object> result = new LinkedHashMap<>();

        objects = queryXrayListByChartNoDateRange(chartNo, startDate, endDate);

        int count = objects.stream()
                .mapToInt(map -> 1)
                .sum();
        result.put("count", count);

        return result;
    }

    public List<Map<String, Object>> queryXrayCountByChartNoDateRangeGroupByType(int chartNo, String startDate, String endDate) throws SQLException {
        List<Map<String, Object>> objects;
        List<Map<String, Object>> resultList = new ArrayList<>();

        objects = queryXrayListByChartNoDateRange(chartNo, startDate, endDate);

        // group mapList by inp_opd, cat_type, cat_name
        Map<Map<String, Object>, List<Map<String, Object>>> groupMap = MapGroupingUtil.getGroupingResultMap(objects,
                Arrays.asList("inp_opd", "cat_type", "cat_name"),
                Arrays.asList("xray_type", "years", "view_date", "chart_no", "serno", "seq_no", "form_name"));

        // add count for group by inp_opd, cat_type, cat_name
        groupMap.forEach((key, value) -> key.put("count", value.size()));

        // get grouping data
        groupMap.forEach((key, value) -> resultList.add(key));

        return resultList;
    }

    public List<Map<String, Object>> queryXrayListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.xray_type, a.inp_opd, substr(a.view_date, 1, 3) years, a.view_date, a.chart_no, a.serno,  " +
                "       a.seq_no, b.form_name, b.xray_type cat_type, c.name cat_name, d.access_no " +
                "  FROM xrayrpt a, xryform b, justname c, requisition d " +
                " WHERE a.chart_no = ? " +
                "   AND a.view_date BETWEEN ? AND ? " +
                "   AND a.xray_type = b.form_no(+)  " +
                "   AND (b.xray_type = c.no(+) AND c.categories = 'XRAYTYPE') " +
                "   AND a.req_no = d.req_no(+) " +
                " ORDER BY a.view_date desc, a.xray_type ";

        EntityFactory xrayReportEntity = new EntityFactory(con, queryString);
        return xrayReportEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }


    public Map<String, Object> queryXrayReportByPrimaryKeys(String xrayType, String inpOpd, String viewDate, int chartNo, int serno, int seqNo) throws SQLException {
        String queryString =
                "  SELECT a.xray_type, b.form_name xray_name, a.inp_opd, a.view_date, a.chart_no, a.serno, a.seq_no, a.doctor_no, " +
                "         c.emp_name doctor_name, a.diagnosis, a.xray_date, a.xray_time, a.report_date, a.report_time, " +
                "         a.reporter, d.emp_name reporter_name, a.report, a.complaint, a.findings " +
                "    FROM xrayrpt a, xryform b, employee c, employee d " +
                "   WHERE a.xray_type = ? " +
                "     AND a.inp_opd = ? " +
                "     AND a.view_date = ? " +
                "     AND a.chart_no = ? " +
                "     AND a.serno = ? " +
                "     AND a.seq_no = ? " +
                "     AND a.xray_type = b.form_no(+) " +
                "     AND a.doctor_no = c.emp_no(+) " +
                "     AND a.reporter = d.emp_no(+) ";

        EntityFactory xrayReportEntity = new EntityFactory(con, queryString);
        return xrayReportEntity.findSingle(new Object[]{xrayType, inpOpd, viewDate, chartNo, serno, seqNo});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            XrayReport xrayReport = new XrayReport(myConnection);

            int chartNo = 912473;
            int years = 105;
            String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
            String endDate = DateUtil.dateToROCDateString(LocalDate.now());

            System.out.printf("\nXrayReport.queryXrayCountByChartNoDateRange chartNo=%d startDate=%s endDate=%s JsonObject:%s ",
                    chartNo, startDate, endDate, MapUtil.mapToJsonObject(xrayReport.queryXrayCountByChartNoDateRange(chartNo, startDate, endDate)).toString());

            System.out.printf("\nXrayReport.queryXrayCountByChartNoDateRangeGroupByType chartNo=%d startDate=%s endDate=%s JsonArray:%s ",
                    chartNo, startDate, endDate, MapUtil.listMapToJsonArray(xrayReport.queryXrayCountByChartNoDateRangeGroupByType(chartNo, startDate, endDate)).toString());

            System.out.printf("\nXrayReport.queryXrayListByChartNoDateRange chartNo=%d startDate=%s endDate=%s JsonArray:%s ",
                    chartNo, startDate, endDate, MapUtil.listMapToJsonArray(xrayReport.queryXrayListByChartNoDateRange(chartNo, startDate, endDate)).toString());

            String xrayType = "FG01";
            String inpOpd = "I";
            String viewDate = "1030505";
            int serno = 94771;
            int seqNo = 1;
            System.out.printf("\nXrayReport.queryXrayReportByPrimaryKeys xrayType=%s, inpOpd=%s, viewDate=%s chartNo=%d serno=%d seqNo=%d JsonObject:%s ",
                    xrayType, inpOpd, viewDate, chartNo, serno, seqNo, MapUtil.mapToJsonObject(xrayReport.queryXrayReportByPrimaryKeys(xrayType, inpOpd, viewDate, chartNo, serno, seqNo)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
