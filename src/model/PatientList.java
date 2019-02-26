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
 * Created by jeffy on 2017/10/18.
 */
public class PatientList {
    private Connection con;

    public PatientList(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryPatientListOpd(String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT 'OPD' visit_type, a.chart_no, a.duplicate_no serno, b.pt_name, b.sex, " +
                "        CASE WHEN b.sex = 1 THEN '男' WHEN b.sex = 2 THEN '女' ELSE '未知' END AS sex_name, " +
                "        b.id_no, b.birth_date, 0 age, c.content tel, a.view_date, " +
                "        null ckin_date, null discharge_date, a.doctor_no, d.emp_name doctor_name, " +
                "        a.div_no, e.div_name, a.apn, CASE WHEN a.apn = 1 THEN '早' WHEN a.apn = 2 THEN '午' WHEN a.apn = 3 THEN '晚' ELSE null END AS apn_name, " +
                "        a.clinic , null bed_no, null ns, null ns_name  " +
                "  FROM patopd a, chart b, chtcontact c, employee d, division e " +
                " WHERE a.view_date BETWEEN ? AND ? " +
                "   AND (a.opd_clerk IS NOT NULL OR a.treat_clerk IS NOT NULL) " +
                "   AND a.chart_no = b.chart_no(+) " +
                "   AND (a.chart_no = c.chart_no and c.contact_no = 'HTEL') " +
                "   AND a.doctor_no = d.emp_no(+)  " +
                "   AND a.div_no = e.div_no(+) " +
                " ORDER BY view_date desc, chart_no, serno ";

        EntityFactory patientListEntity = new EntityFactory(con, queryString);
        return patientListEntity.findMultiple(new Object[]{startDate, endDate});
    }

    public List<Map<String, Object>> queryPatientListInp(String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT 'INP' visit_type, a.chart_no, a.serno, b.pt_name, b.sex, " +
                "       CASE WHEN b.sex = 1 THEN '男' WHEN b.sex = 2 THEN '女' ELSE '未知' END AS sex_name, " +
                "       b.id_no, b.birth_date, 0 age, c.content tel, null view_date, " +
                "       a.ckin_date, a.discharge_date, a.vs, d.emp_name doctor_name, " +
                "       a.div_no, e.div_name, null apn, null apn_name, " +
                "       null clinic, a.bed_no, f.ns, g.dept_name ns_name " +
                "  FROM patinp a, chart b, chtcontact c, employee d, division e, bed f, department g " +
                " WHERE a.discharge_date IS NULL " +
                "   AND a.status > 0 " +
                "   AND a.chart_no = b.chart_no(+) " +
                "   AND (a.chart_no = c.chart_no and c.contact_no = 'HTEL') " +
                "   AND a.vs = d.emp_no(+) " +
                "   AND a.div_no = e.div_no(+) " +
                "   AND a.bed_no = f.bed_no(+) " +
                "   AND f.ns = g.dept_no(+) " +
                " ORDER BY ckin_date desc, chart_no, serno ";

        EntityFactory patientListEntity = new EntityFactory(con, queryString);
        return patientListEntity.findMultiple(new Object[]{});
    }

    public List<Map<String, Object>> queryPatientListDischarge(String startDate, String endDate) throws SQLException {
        String queryString =
                "SELECT 'DIS' visit_type, a.chart_no, a.serno, b.pt_name, b.sex, " +
                "       CASE WHEN b.sex = 1 THEN '男' WHEN b.sex = 2 THEN '女' ELSE '未知' END AS sex_name, " +
                "       b.id_no, b.birth_date, 0 age, c.content tel, null view_date, " +
                "       a.ckin_date, a.discharge_date, a.vs, d.emp_name doctor_name, " +
                "       a.div_no, e.div_name, null apn, null apn_name, " +
                "       null clinic, a.bed_no, f.ns, g.dept_name ns_name " +
                "  FROM patinp a, chart b, chtcontact c, employee d, division e, bed f, department g " +
                " WHERE a.discharge_date BETWEEN ? AND ? " +
                "   AND a.chart_no = b.chart_no(+) " +
                "   AND (a.chart_no = c.chart_no and c.contact_no = 'HTEL') " +
                "   AND a.vs = d.emp_no(+) " +
                "   AND a.div_no = e.div_no(+) " +
                "   AND a.bed_no = f.bed_no(+) " +
                "   AND f.ns = g.dept_no(+) " +
                " ORDER BY ckin_date desc, chart_no, serno ";

        EntityFactory patientListEntity = new EntityFactory(con, queryString);
        return patientListEntity.findMultiple(new Object[]{startDate, endDate});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            PatientList patientList = new PatientList(myConnection);
            String endDate = DateUtil.dateToROCDateString(LocalDate.now());
            String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-2, ChronoUnit.YEARS));

            System.out.printf("\nPatientList.queryPatientListOpd startDate=%s endDate=%s JsonArray: %s ",
                    startDate, endDate, MapUtil.listMapToJsonArray(patientList.queryPatientListOpd(startDate, endDate)));

            System.out.printf("\nPatientList.queryPatientListInp startDate=%s endDate=%s JsonArray: %s ",
                    startDate, endDate, MapUtil.listMapToJsonArray(patientList.queryPatientListInp(startDate, endDate)));

            startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-2, ChronoUnit.YEARS));
            System.out.printf("\nPatientList.queryPatientListDischarge startDate=%s endDate=%s JsonArray: %s ",
                    startDate, endDate, MapUtil.listMapToJsonArray(patientList.queryPatientListDischarge(startDate, endDate)));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}

