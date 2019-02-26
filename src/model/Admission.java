package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static library.utility.MapUtil.castToInt;

/**
 * Created by jeffy on 2017/2/8.
 */
public class Admission {
    private Connection con;

    public Admission(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryAdmissionListByChartNoSerno(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.cut_serno, a.ckin_date, a.bed_no, a.div_no, b.div_name, " +
                "       a.vs, c.emp_name vs_name, a.complaint, a.path_h, a.system_review, a.charth, " +
                "       a.diagnosis, a.diagnosis_o, a.labdata, a.plan, a.keyin_clerk, d.emp_name keyin_clerk_name, " +
                "       a.keyin_date, a.keyin_time, a.printed_flag,  a.finished_flag " +
                "  FROM admission a, division b, employee c, employee d " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.div_no = b.div_no(+)  " +
                "   AND a.vs = c.emp_no(+) " +
                "   AND a.keyin_clerk = d.emp_no(+)  ";

        EntityFactory admissionEntity = new EntityFactory(con, queryString);
        return admissionEntity.findMultiple(new Object[]{chartNo, serno});
    }

    public Map<String, Object> queryAdmissionCountByChartNoSerno(int chartNo, int serno) throws SQLException {
        Map<String, Object> resultMap = new LinkedHashMap<>();
        List<Map<String, Object>> mapList = queryAdmissionListByChartNoSerno(chartNo, serno);

        Object none = mapList.isEmpty() ? resultMap.put("count", 0) : resultMap.put("count", mapList.size());
        
        return resultMap;
    }

    public Map<String, Object> queryAdmissionDataByPrimaryKeys(int chartNo, int serno, int cutSerno) throws SQLException {
        List<Map<String, Object>> mapList = queryAdmissionListByChartNoSerno(chartNo, serno);
        
        return mapList.stream()
                .filter(map -> cutSerno == castToInt(map.get("cut_serno")))
                .findFirst().orElseGet(LinkedHashMap::new);
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Admission admission = new Admission(myConnection);

            System.out.println("\nAdmission.queryAdmissionListByChartNoSerno chartNo=912473 serno=94771 JsonObject: " +
                    MapUtil.listMapToJsonArray(admission.queryAdmissionListByChartNoSerno(912473, 94771)));

            System.out.println("\nAdmission.queryAdmissionCountByChartNoSerno chartNo=912473 serno=94771 JsonObject: " +
                    MapUtil.mapToJsonObject(admission.queryAdmissionCountByChartNoSerno(912473, 94771)));

            System.out.println("\nAdmission.queryAdmissionDataByPrimaryKeys chartNo=912473 serno=94771 cutSerno=0 JsonObject: " +
                    MapUtil.mapToJsonObject(admission.queryAdmissionDataByPrimaryKeys(912473, 94771, 0)));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
