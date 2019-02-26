package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2017/2/9.
 */
public class DrProgress {
    private Connection con;

    public DrProgress(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryDrProgressCountByChartNoSerno(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT count(a.chart_no) count " +
                "  FROM drprogress a " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? ";

        EntityFactory drProgressEntity = new EntityFactory(con, queryString);
        return drProgressEntity.findSingle(new Object[]{chartNo, serno});
    }

    public Map<String, Object> queryDrProgressCountByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.chart_no, COUNT(a.chart_no) count " +
                "  FROM drprogress a " +
                " WHERE a.chart_no = ? " +
                "   AND a.progress_date BETWEEN ? AND ? " +
                " GROUP BY a.chart_no ";

        EntityFactory drProgressEntity = new EntityFactory(con, queryString);
        return drProgressEntity.findSingle(new Object[]{chartNo, startDate, endDate});
    }

    public List<Map<String, Object>> queryDrProgressListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT substr(a.progress_date, 1, 3) years, a.chart_no, a.serno, a.progress_date, a.progress_time, a.order_dr, b.emp_name order_dr_name, " +
                "       a.keyin_clerk, c.emp_name keyin_clerk_name, a.question_num, a.question_txt, a.end_date, a.end_time, " +
                "       a.stop_reason, a.content, a.content_o, a.content_a, a.content_p, a.memo " +
                "  FROM drprogress a, employee b, employee c " +
                " WHERE a.chart_no = ? " +
                "   AND a.progress_date BETWEEN ? AND ? " +
                "   AND a.order_dr = b.emp_no(+) " +
                "   AND a.keyin_clerk = c.emp_no(+) " +
                " ORDER BY a.chart_no, a.serno, a.progress_date desc, a.progress_time desc ";

        EntityFactory drProgressEntity = new EntityFactory(con, queryString);
        return drProgressEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }

    public Map<String, Object> queryDrProgressDataByPrimaryKeys(int chartNo, int serno, String progressDate, String progressTime ) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.progress_date, a.progress_time, a.order_dr, b.emp_name order_dr_name, " +
                "       a.keyin_clerk, c.emp_name keyin_clerk_name, a.question_num, a.question_txt, a.end_date, a.end_time, " +
                "       a.stop_reason, a.content, a.content_o, a.content_a, a.content_p, a.memo " +
                "  FROM drprogress a, employee b, employee c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.progress_date = ? " +
                "   AND a.progress_time = ? " +
                "   AND a.order_dr = b.emp_no(+) " +
                "   AND a.keyin_clerk = c.emp_no(+) ";

        EntityFactory drProgressEntity = new EntityFactory(con, queryString);
        return drProgressEntity.findSingle(new Object[]{chartNo, serno, progressDate, progressTime});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            DrProgress drProgress = new DrProgress(myConnection);

            System.out.println("\nDrProgress.queryDrProgressCountByChartNoSerno chartNo=6 serno=61991 JsonObject: " +
                    MapUtil.mapToJsonObject(drProgress.queryDrProgressCountByChartNoSerno(6, 61991)));

            System.out.println("\nDrProgress.queryDrProgressCountByChartNoDateRange chartNo=6 startDate='1040713'" +
                    " endDate='1040714' JsonObject: " +
                    MapUtil.mapToJsonObject(drProgress.queryDrProgressCountByChartNoDateRange(6, "1040713", "1040714")));

            System.out.println("\nDrProgress.queryDrProgressListByChartNoDateRange chartNo=6 startDate='1040713'" +
                    " endDate='1040714' JsonArray: " +
                    MapUtil.listMapToJsonArray(drProgress.queryDrProgressListByChartNoDateRange(6, "1040713", "1040714")));

            System.out.println("\nDrProgress.queryDrProgressDataByPrimaryKeys chartNo=6 serno=61991" +
                    " progressDate='1040713' progressTime='144014' JsonObject: " +
                    MapUtil.mapToJsonObject(drProgress.queryDrProgressDataByPrimaryKeys(6, 61991, "1040713", "144014")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
