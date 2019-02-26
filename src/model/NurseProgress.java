package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2017/11/7.
 */
public class NurseProgress {
    private Connection con;

    public NurseProgress(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryNurseProgressCountByChartNoSerno(int chartNo, int serno ) throws SQLException {
        String queryString =
                "SELECT count(a.chart_no) count " +
                        "  FROM nurseprogress a " +
                        " WHERE a.chart_no = ? " +
                        "   AND a.serno = ? ";

        EntityFactory nurseProgressEntity = new EntityFactory(con, queryString);
        return nurseProgressEntity.findSingle(new Object[]{chartNo, serno});
    }

    public Map<String, Object> queryNurseProgressCountByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.chart_no, COUNT(a.chart_no) count " +
                "  FROM nurseprogress a " +
                " WHERE a.chart_no = ? " +
                "   AND a.progress_date BETWEEN ? AND ? " +
                " GROUP BY a.chart_no ";

        EntityFactory nurseProgressEntity = new EntityFactory(con, queryString);
        return nurseProgressEntity.findSingle(new Object[]{chartNo, startDate, endDate});
    }

    public List<Map<String, Object>> queryNurseProgressListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT substr(a.progress_date, 1, 3) years, a.chart_no, a.serno, a.progress_date, a.progress_time, a.content, " +
                "       a.nurse_no, b.emp_name nurse_name, a.keyin_clerk, c.emp_name keyin_clerk_name " +
                "  FROM nurseprogress a, employee b, employee c " +
                " WHERE a.chart_no = ? " +
                "   AND a.progress_date BETWEEN ? AND ? " +
                "   AND a.nurse_no = b.emp_no(+) " +
                "   AND a.keyin_clerk = c.emp_no(+) " +
                " ORDER BY a.chart_no, a.serno, a.progress_date desc, a.progress_time desc ";

        EntityFactory nurseProgressEntity = new EntityFactory(con, queryString);
        return nurseProgressEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }

    public List<Map<String, Object>> queryNurseProgressByPrimaryKeys(int chartNo, int serno, String progressDate, String progressTime ) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.progress_date, a.progress_time, a.content, a.nurse_no, b.emp_name nurse_name, " +
                "       a.keyin_clerk, c.emp_name keyin_clerk_name " +
                "  FROM nurseprogress a, employee b, employee c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.progress_date = ? " +
                "   AND a.progress_time = ? " +
                "   AND a.nurse_no = b.emp_no(+) " +
                "   AND a.keyin_clerk = c.emp_no(+) ";

        EntityFactory nurseProgressEntity = new EntityFactory(con, queryString);
        return nurseProgressEntity.findMultiple(new Object[]{chartNo, serno, progressDate, progressTime});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            NurseProgress nurseProgress = new NurseProgress(myConnection);

            System.out.println("\nNurseProgress.queryNurseProgressCountByChartNoSerno  chartNo=912473 serno=94771 JsonObject: " +
                    MapUtil.mapToJsonObject(nurseProgress.queryNurseProgressCountByChartNoSerno(973950, 86973)));

            System.out.println("\nNurseProgress.queryNurseProgressCountByChartNoDateRange " +
                    "chartNo=912473 startDate='1020522' endDate='1020524' JsonObject: " +
                    MapUtil.mapToJsonObject(nurseProgress.queryNurseProgressCountByChartNoDateRange(973950, "1020522", "1020524")));

            System.out.println("\nNurseProgress.queryNurseProgressListByChartNoDateRange chartNo=973950 startDate='1020522' endDate='1020524' JsonArray: " +
                    MapUtil.listMapToJsonArray(nurseProgress.queryNurseProgressListByChartNoDateRange(973950, "1020522", "1020524")));

            System.out.println("\nNurseProgress.queryNurseProgressByChartNoSerno chartNo=973950 serno=86973 JsonArray: " +
                    MapUtil.listMapToJsonArray(nurseProgress.queryNurseProgressByPrimaryKeys(973950, 86973, "1020524", "173017")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
