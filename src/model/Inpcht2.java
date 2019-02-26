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
public class Inpcht2 {
    private Connection con;

    public Inpcht2(Connection con) {
        this.con = con;
    }


    public List<Map<String, Object>> queryInpcht2ByChartNoSernoOrderType(int chartNo, int serno, String orderType) throws SQLException {

        String queryString =
                "SELECT a.chart_no, a.serno, a.acnt_date, a.order_type, a.rec_count, a.code, " +
                "       b.full_name, b.full_name_c, b.unit, b.s_unit, a.orig_identify_no, a.identify_no, " +
                "       a.acnt_no, a.price_type, a.start_date, a.start_time, a.end_date, a.end_time, " +
                "       a.qty, a.unuse, e.name_c unuse_name_c, e.name_e unuse_name_e, " +
                "       a.use, c.name_c use_name_c, c.name_e use_name_e, a.usetime, " +
                "       a.day, a.tqty, a.first_tqty, a.self, a.discount, a.comp_discount, a.amt, a.he_add_fee, " +
                "       a.method, d.name_c method_name_c, d.name_e method_name_e, a.method1, a.method2, " +
                "       a.emg, a.add_rate, a.office, a.stock, a.grind, " +
                "       a.cashier, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.cashier) cashier_name, " +
                "       a.order_datetime, a.doctor_no, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.doctor_no) doctor_name, " +
                "       a.exec_datetime, a.exec_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.exec_clerk) exec_clerk_name, " +
                "       a.report_datetime, a.report_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.report_clerk) report_clerk_name, " +
                "       a.operation, a.req_no, a.take_home, a.do_tqty, a.do_status, " +
                "       a.keyin_datetime, a.keyin_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.keyin_clerk) keyin_clerk_name, " +
                "       a.modify_datetime, a.modify_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.modify_clerk) modify_clerk_name, " +
                "       a.treat_emg, a.remark, a.bed_no, " +
                "       a.cons_no, a.noexe_reason, a.attend_bed_no, a.office1, a.is_take, " +
                "       a.max_price_times, a.order_pos, a.or_rate, a.flow_speed, a.project_no, " +
                "       a.dicom_flag, a.div_no, (SELECT b.div_name FROM division b WHERE b.div_no = a.div_no) div_name, " +
                "       a.code_flag, a.code_flag_clerk, a.sentd_msg " +
                "  FROM inpcht2 a, price b, vuse c, method d, vunuse e  " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.order_type = ?  " +
                "   AND a.code = b.code(+) " +
                "   AND a.use = c.frequency_no(+) " +
                "   AND a.method = d.method_no(+) " +
                "   AND a.use = e.frequency_no(+) " +
                " ORDER BY a.chart_no, a.serno, a.order_type, a.acnt_date desc, a.rec_count ";

        EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
        return inpcht2Entity.findMultiple(new Object[]{chartNo, serno, orderType});
    }

    public String getOPDate(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT min(acnt_date) op_date  " +
                        "  FROM inpcht2 " +
                        " WHERE chart_no = ? " +
                        "   AND serno = ?  " +
                        "   AND acnt_no = 32 ";

        EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
        Map<String, Object> map = inpcht2Entity.findSingle(new Object[]{chartNo, serno});
        return map.get("op_date") != null ? (String)map.get("op_date") : null;
    }

    public static void main(String[] args) {
        String resultString;

        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();

        try {
            myConnection = jdbcUtil.getConnection();
            Inpcht2 inpcht2 = new Inpcht2(myConnection);

            int chartNo = 912473;
            int serno = 94771;
            String orderType = "S";

            System.out.printf("\nInpcht2.queryInpcht2ByChartNoSernoOrderType chartNo=%d serno=%d orderType=%s JsonArray:%s ",
                    chartNo, serno, orderType, MapUtil.listMapToJsonArray(inpcht2.queryInpcht2ByChartNoSernoOrderType(chartNo, serno, orderType)).toString());

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }

}
