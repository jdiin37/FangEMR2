package model;

import library.dateutility.DateComputeUtil;
import library.dateutility.DateUtil;
import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2017/10/12.
 */
public class Patopd {
    private Connection con;

    public Patopd(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryPatopdListByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT substr(a.view_date, 1, 3) years, a.view_date, a.chart_no, a.duplicate_no, a.doctor_no, b.emp_name doctor_name, " +
                "       a.div_no, c.div_name,  a.cash_type, d.name cash_type_name, " +
                "       a.pt_type, e.type_name, a.card_seq, a.part_no, f.part_name " +
                "  FROM patopd a, employee b, division c, justname d, pttype e, partamt f " +
                " WHERE a.view_date BETWEEN ? AND ? " +
                "   AND a.chart_no = ? " +
                "   AND (a.opd_clerk IS NOT NULL OR a.treat_clerk IS NOT NULL) " +
                "   AND a.doctor_no = b.emp_no(+) " +
                "   AND a.div_no = c.div_no(+) " +
                "   AND (a.cash_type = d.no(+) and d.categories = 'CASHTYPE') " +
                "   AND a.pt_type = e.pt_type(+) " +
                "   AND a.part_no = f.part_no(+) " +
                " ORDER BY a.view_date, a.chart_no, a.duplicate_no ";

        EntityFactory patopdEntity = new EntityFactory(con, queryString);
        return patopdEntity.findMultiple(new Object[]{startDate, endDate, chartNo});
    }

    public Map<String, Object> queryFirstAndLastViewDateByChartNo(int chartNo) throws SQLException {
        String queryString =
                "SELECT MIN(a.view_date) first_view_date, MAX(a.view_date) last_view_date  " +
                "  FROM patopd a " +
                " WHERE a.chart_no = ? " +
                "   AND (a.opd_clerk IS NOT NULL OR a.treat_clerk IS NOT NULL) ";

        EntityFactory patopdEntity = new EntityFactory(con, queryString);
        return patopdEntity.findSingle(new Object[]{chartNo});
    }

    public Map<String, Object> queryOpdCountByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.chart_no, COUNT(a.chart_no) count " +
                "  FROM patopd a " +
                " WHERE a.chart_no = ? " +
                "   AND a.view_date BETWEEN ? AND ? " +
                "   AND (a.opd_clerk IS NOT NULL OR a.treat_clerk IS NOT NULL) " +
                " GROUP BY a.chart_no ";

        EntityFactory patopdEntity = new EntityFactory(con, queryString);
        return patopdEntity.findSingle(new Object[]{chartNo, startDate, endDate});
    }

    public List<Map<String, Object>> queryOpdCountByChartNoDateRangeGroupByType(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT chart_no, cash_type, count(cash_type) count " +
                "  FROM (SELECT a.chart_no, " +
                "               CASE WHEN a.cash_type = 'E' THEN 'EMG' " +
                "                    ELSE 'OPD' " +
                "                END AS cash_type " +
                "          FROM patopd a " +
                "         WHERE a.chart_no = ? " +
                "           AND a.view_date BETWEEN ? AND ? " +
                "           AND (a.opd_clerk IS NOT NULL OR a.treat_clerk IS NOT NULL) " +
                "       ) " +
                " GROUP BY chart_no, cash_type ";

        EntityFactory patopdEntity = new EntityFactory(con, queryString);
        return patopdEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Patopd patopd = new Patopd(myConnection);

            int chartNo = 912473;
            String startDate = "1031104";
            String endDate = "1031104";
            System.out.printf("\nPatopd.queryPatopdListByChartNoDateRange startDate='%s' endDate='%s' chartNo=%d JsonArray:%s ",
                    startDate, endDate, chartNo, MapUtil.listMapToJsonArray(patopd.queryPatopdListByChartNoDateRange(chartNo, startDate, endDate)).toString());

            System.out.printf("\nPatopd.queryFirstAndLastViewDateByChartNo chartNo=%d JsonObject:%s ",
                    chartNo, MapUtil.mapToJsonObject(patopd.queryFirstAndLastViewDateByChartNo(chartNo)).toString());

            startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-4, ChronoUnit.YEARS));
            endDate = DateUtil.dateToROCDateString(LocalDate.now());
            System.out.printf("\nPatopd.queryOpdCountByChartNoDateRange chartNo=%d startDate=%s endDate=%s JsonObject:%s ",
                   chartNo, startDate, endDate, MapUtil.mapToJsonObject(patopd.queryOpdCountByChartNoDateRange(chartNo, startDate, endDate)).toString());

            startDate = "1021031";
            endDate = "1030504";
            System.out.printf("\nPatopd.queryOpdCountByChartNoDateRangeGroupByType chartNo=%d startDate=%s endDate=%s JsonArray:%s ",
                    chartNo, startDate, endDate, MapUtil.listMapToJsonArray(patopd.queryOpdCountByChartNoDateRangeGroupByType(chartNo, startDate, endDate)).toString());


        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}

