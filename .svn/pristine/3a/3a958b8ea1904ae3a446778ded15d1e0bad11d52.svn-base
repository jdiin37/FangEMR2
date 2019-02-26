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
import java.util.function.Function;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToInt;

/**
 * Created by jeffy on 2017/11/7.
 */
public class OutNote {
    private Connection con;

    public OutNote(Connection con) {
        this.con = con;
    }

//    public Map<String, Object> queryOutnoteCountByChartNoDateRange(int chartNo, String startDate, String endDate) throws SQLException {
//        String queryString =
//                "SELECT a.chart_no, count(a.chart_no) count " +
//                "  FROM outnote a " +
//                " WHERE a.chart_no = ? " +
//                "   AND a.ckin_date BETWEEN ? AND ? " +
//                " GROUP BY a.chart_no ";
//
//        EntityFactory outnoteEntity = new EntityFactory(con, queryString);
//        return outnoteEntity.findSingle(new Object[]{chartNo, startDate, endDate});
//    }

    public List<Map<String, Object>> queryOutnoteListByChartNoSerno(int chartNo, int serno) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.serno, a.cut_serno, a.ckin_date, a.discharge_date, a.inout_day,  " +
                "       a.div_no, b.div_name, a.bed_no, a.in_diagnosis, a.out_diagnosis, a.trans_in, f.hosp_name, " +
                "       a.cc, a.ph, a.pe, a.or_desc, a.treatment, a.complication, a.general_lab, a.special_lab, " +
                "       a.xray_rep, a.xray_rep2, a.xray_rep3, a.pathologic_rep, a.other, a.out_status, " +
                "       a.out_directory, a.keyin_clerk, c.emp_name keyin_clerk_name, a.keyin_date, a.keyin_time, " +
                "       a.printed_flag, a.finished_flag, a.finished_flag_r, a.ckin_date_f, " +
                "       a.vs_complete_date, a.r_complete_date, a.begin_date, a.end_date, " +
                "       a.vs, d.emp_name vs_name, a.r, e.emp_name r_name, g.source " +
                "  FROM outnote a, division b, employee c, employee d, employee e, hospital f, patinp g " +
                " WHERE a.chart_no = ? " +
                "   AND a.serno = ? " +
                "   AND a.div_no = b.div_no(+) " +
                "   AND a.keyin_clerk = c.emp_no(+) " +
                "   AND a.vs = d.emp_no(+) " +
                "   AND a.r = e.emp_no(+) " +
                "   AND a.trans_in = f.hosp_no(+) " +
                "   AND (a.chart_no = g.chart_no(+) AND a.serno = g.serno(+)) ";

        EntityFactory outnoteEntity = new EntityFactory(con, queryString);
        return outnoteEntity.findMultiple(new Object[]{chartNo, serno});
    }

    public Map<String, Object> queryOutnoteCountByChartNoSerno(int chartNo, int serno) throws SQLException {
        Map<String, Object> resultMap = new LinkedHashMap<>();
        List<Map<String, Object>> mapList = queryOutnoteListByChartNoSerno(chartNo, serno);

        Object none = mapList.isEmpty() ? resultMap.put("count", 0) : resultMap.put("count", mapList.size());

        return resultMap;
    }

    public Map<String, Object> queryOutnoteDataByPrimaryKeys(int chartNo, int serno, int cutSerno) throws SQLException {
        List<Map<String, Object>> mapList = queryOutnoteListByChartNoSerno(chartNo, serno);

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
            OutNote outNote = new OutNote(myConnection);

            System.out.println("\nOutNote.queryOutnoteCountByChartNoSerno chartNo=912473 serno=94771 JsonObject: " +
                    MapUtil.mapToJsonObject(outNote.queryOutnoteCountByChartNoSerno(912473, 94771)));

//            System.out.println("\nOutNote.queryOutnoteCountByChartNoDateRange chartNo=912473 startDate='1030504' endDate='1030507' JsonObject: " +
//                    MapUtil.mapToJsonObject(outNote.queryOutnoteCountByChartNoDateRange(912473, "1030504", "1030507")));

            System.out.println("\nOutNote.queryOutnoteListByChartNoSerno chartNo=912473 serno=94771 JsonObject: " +
                    MapUtil.listMapToJsonArray(outNote.queryOutnoteListByChartNoSerno(912473, 94771)));

            System.out.println("\nOutNote.queryOutnoteDataByPrimaryKeys chartNo=912473 serno=94771 cutSerno=0 JsonObject: " +
                    MapUtil.mapToJsonObject(outNote.queryOutnoteDataByPrimaryKeys(912473, 94771, 0)));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}
