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
public class Chgbed {
    private Connection con;

    public Chgbed(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryChgbedCountByChartNoSerno(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT count(a.chart_no) count " +
                "  FROM chgbed a " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.categories = 3 ";

        EntityFactory chgbedEntity = new EntityFactory(con, queryString);
        return chgbedEntity.findSingle(new Object[]{chartNo, serno});
    }

    public List<Map<String, Object>> queryChgbedByChartNoSerno(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.categories, a.change_date, a.change_time, a.bed_no, " +
                "       b.room_type, c.name room_type_name, a.he_bed_no, a.admit_days,  " +
                "       a.chronic_flag, a.he_flag, a.keyin_datetime, a.keyin_clerk " +
                "  FROM chgbed a, bed b, roomtype c " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.categories = '3' " +
                "   AND a.bed_no = b.bed_no(+) " +
                "   AND b.room_type = c.room_type(+) " +
                "ORDER BY a.chart_no, a.serno, a.change_date desc, a.change_time desc ";

        // categories(varchar2(1)) => 1:住院  2:轉床  3:留院  4:出院  5:健保申報  6:前台部分負擔

        EntityFactory chgbedEntity = new EntityFactory(con, queryString);
        return chgbedEntity.findMultiple(new Object[]{chartNo, serno});
    }

    public List<Map<String, Object>> queryChgbedCountByChartNoDateRangeGroupByRoomType(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT b.room_type, c.name room_type_name, count(b.room_type) count " +
                "  FROM chgbed a, bed b, roomtype c " +
                " WHERE a.chart_no = ? " +
                "   AND a.change_date BETWEEN ? AND ? " +
                "   AND a.categories = '3' " +
                "   AND a.bed_no = b.bed_no(+) " +
                "   AND b.room_type = c.room_type(+) " +
                " GROUP BY b.room_type, c.name " +
                "ORDER BY count(b.room_type) desc ";

        EntityFactory chgbedEntity = new EntityFactory(con, queryString);
        return chgbedEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }

    public List<Map<String, Object>> queryChgbedListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT substr(a.change_date, 1, 3) years, a.chart_no, a.serno, a.categories, a.change_date, a.change_time, " +
                "       a.bed_no, b.room_type, c.name room_type_name, a.he_bed_no, a.admit_days, a.chronic_flag, a.he_flag, " +
                "       a.keyin_datetime, a.keyin_clerk " +
                "  FROM chgbed a, bed b, roomtype c " +
                " WHERE a.chart_no = ? " +
                "   AND a.change_date BETWEEN ? AND ? " +
                "   AND a.categories = '3' " +
                "   AND a.bed_no = b.bed_no(+) " +
                "   AND b.room_type = c.room_type(+) " +
                "ORDER BY a.chart_no, a.serno, a.change_date desc, a.change_time desc ";

        // categories(varchar2(1)) => 1:住院  2:轉床  3:留院  4:出院  5:健保申報  6:前台部分負擔

        EntityFactory chgbedEntity = new EntityFactory(con, queryString);
        return chgbedEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Chgbed chgbed = new Chgbed(myConnection);

            System.out.println("\nChgbed.queryChgbedCountByChartNoSerno chartNo=973950 serno=97716 JsonObject: " +
                    MapUtil.mapToJsonObject(chgbed.queryChgbedCountByChartNoSerno(973950, 97716)));

            System.out.println("\nChgbed.queryChgbedByChartNoSerno chartNo=973950 serno=97716 JsonArray: " +
                    MapUtil.listMapToJsonArray(chgbed.queryChgbedByChartNoSerno(973950, 97716)));

            System.out.println("\nChgbed.queryChgbedCountByChartNoDateRangeGroupByRoomType chartNo=973950 startDate='1030901' endDate='1030911' JsonArray: " +
                    MapUtil.listMapToJsonArray(chgbed.queryChgbedCountByChartNoDateRangeGroupByRoomType(973950, "1030901", "1030911")));

            System.out.println("\nChgbed.queryChgbedListByChartNoDateRange chartNo=973950 startDate='1030901' endDate='1030911' JsonArray: " +
                    MapUtil.listMapToJsonArray(chgbed.queryChgbedListByChartNoDateRange(973950, "1030901", "1030911")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
