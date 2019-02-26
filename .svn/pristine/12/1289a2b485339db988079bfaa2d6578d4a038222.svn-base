package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/3/1.
 */
public class Udd2 {
    private Connection con;

    public Udd2(Connection con) {
        this.con = con;
    }


    public List<Map<String, Object>> queryUdd2ByChartNoSerno(int chartNo, int serno) throws SQLException {

        String queryString =
                "SELECT a.chart_no, a.serno, a.rec_count, a.code, b.price_type, b.full_name, " +
                "       b.unit, b.s_unit, a.start_date, a.start_time, a.dc_date, a.dc_time, a.qty, " +
                "       a.unuse, c.name_c unuse_name_c, c.name_e unuse_name_e, a.use, d.name_c use_name_c, " +
                "       d.name_e use_name_e, a.use_time, a.tqty, a.first_tqty, a.tot_qty, a.self, " +
                "       a.method, e.name_c method_name_c, e.name_e method_name_e, a.stock, a.grind, " +
                "       a.order_datetime, a.doctor_no, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.doctor_no) doctor_name, " +
                "       a.keyin_datetime, a.keyin_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.keyin_clerk) keyin_clerk_name, " +
                "       a.dearness_flag, a.no_fee_flag, a.back_tqty, " +
                "       a.modify_datetime, a.modify_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.modify_clerk) modify_clerk_name, " +
                "       a.flow_speed, a.identify_no, a.project_no, " +
                "       a.div_no, (SELECT b.div_name FROM division b WHERE b.div_no = a.div_no) div_name, " +
                "       a.code_flag, a.code_flag_clerk, a.sentd_msg " +
                "  FROM udd2 a, price b, vunuse c, vuse d, method e " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.code = b.code(+) " +
                "   AND a.unuse = c.frequency_no(+) " +
                "   AND a.use = d.frequency_no(+) " +
                "   AND a.method = e.method_no(+) " +
                " ORDER BY a.chart_no, a.serno, a.rec_count ";


        EntityFactory udd2Entity = new EntityFactory(con, queryString);
        return udd2Entity.findMultiple(new Object[]{chartNo, serno});
    }

    public static void main(String[] args) {
        String resultString;

        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();

        try {
            myConnection = jdbcUtil.getConnection();
            Udd2 udd2 = new Udd2(myConnection);

            int chartNo = 912473;
            int serno = 94771;

            System.out.printf("\nUdd2.queryUdd2ByChartNoSerno chartNo=%d serno=%d JsonArray:%s ",
                    chartNo, serno, MapUtil.listMapToJsonArray(udd2.queryUdd2ByChartNoSerno(chartNo, serno)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }

}
