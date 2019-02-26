package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/2/2.
 */
public class Xrayord {
    private Connection con = null;

    public Xrayord(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo(String xrayType, String inpOpd, String viewDate, int chartNo, int serno, int seqNo) throws SQLException {
        String queryString =
                "SELECT a.seq_no, a.rec_count, a.xray_pos, b.angle_name, a.xray_size, c.size_name, " +
                "       a.qty, a.bad_qty, a.access_no " +
                "  FROM xrayord a, xryangle b, vxraysize c " +
                " WHERE a.xray_type = ? " +
                "   AND inp_opd = ? " +
                "   AND view_date = ? " +
                "   AND chart_no = ? " +
                "   AND serno = ? " +
                "   AND seq_no = ? " +
                "   AND a.xray_pos = b.angle_no(+) " +
                "   AND a.xray_size = c.xray_size(+) " +
                " ORDER BY a.rec_count ";

        EntityFactory xrayordEntity = new EntityFactory(con, queryString);
        return xrayordEntity.findMultiple(new Object[]{xrayType, inpOpd, viewDate, chartNo, serno, seqNo});
    }

    public static void main(String[] args) {
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        Connection myConnection = null;
        String resultStrng = null;

        try {
            myConnection = jdbcUtil.getConnection();
            Xrayord xrayord = new Xrayord(myConnection);

            String xrayType = "XY01";
            String inpOpd = "I";
            String viewDate = "1030505";
            int chartNo = 3461;
            int serno = 94405;
            int seqNo = 1370023;
            System.out.printf("\nXrayord.queryXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo xrayType=%s inpOpd=%s " +
                    "viewDate=%s chartNo=%d serno=%d seqNo=%d JsonArray:%s ", xrayType, inpOpd, viewDate, chartNo, serno, seqNo,
                    MapUtil.listMapToJsonArray(xrayord.queryXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo(xrayType, inpOpd, viewDate, chartNo, serno, seqNo)));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
