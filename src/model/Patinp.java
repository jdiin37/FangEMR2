package model;

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
 * Created by jeffy on 2017/10/13.
 */
public class Patinp {
    private Connection con;

    public Patinp(Connection con) {
        this.con = con;
    }

    public Map<String, Object> queryInpCountBychartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT COUNT(*) count " +
                "  FROM patinp a " +
                " WHERE ckin_date BETWEEN ? AND ? " +
                "   AND a.chart_no = ? " +
                "   AND a.status > 0 ";

        EntityFactory patinpEntity = new EntityFactory(con, queryString);
        return patinpEntity.findSingle(new Object[]{startDate, endDate, chartNo});
    }

    public List<Map<String, Object>> queryPatinpListByChartNoStartDateEndDate(int chartNo, String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.ckin_date start_date, a.discharge_date end_date, " +
                "       0 admit_days, a.vs, b.emp_name doctor_name, a.div_no, c.div_name " +
                "  FROM patinp a, employee b, division c " +
                " WHERE a.chart_no = ? " +
                "   AND a.ckin_date BETWEEN ? AND ? " +
                "   AND a.status <> 0 " +
                "   AND a.vs = b.emp_no(+) " +
                "   AND a.div_no = c.div_no(+) " +
                " ORDER BY chart_no, serno desc ";

        EntityFactory patinpEntity = new EntityFactory(con, queryString);
        return patinpEntity.findMultiple(new Object[]{chartNo, startDate, endDate});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Patinp patinp = new Patinp(myConnection);

            int chartNo = 912473;
            int serno;
            int years;

            chartNo = 9453;
            years = 5;
            String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
            String endDate = DateUtil.dateToROCDateString(LocalDate.now());
            System.out.printf("\nPatinp.queryInpCountBychartNoDateRange chartNo=%d startDate=%s endDate=%s JsonObject:%s ",
                    chartNo, startDate, endDate, MapUtil.mapToJsonObject(patinp.queryInpCountBychartNoDateRange(chartNo, startDate, endDate)).toString());

            chartNo = 912473;
            startDate = "0931214";
            endDate = "1041110";
            System.out.printf("\nPatinp.queryPatinpListByChartNoStartDateEndDate chartNo=%d startDate=%s endDate=%s JsonArray:%s  ",
                    chartNo, startDate, endDate, MapUtil.listMapToJsonArray(patinp.queryPatinpListByChartNoStartDateEndDate(chartNo, startDate, endDate)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}

