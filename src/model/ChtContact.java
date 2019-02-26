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

/**
 * Created by jeffy on 2018/3/14.
 */
public class ChtContact {
    private Connection con;

    public ChtContact(Connection con) {
        this.con = con;
    }

    public List<Map<String, Object>> queryChtContactByChartNo(int chartNo) throws SQLException {
        String queryString =
                "SELECT a.chart_no, a.contact_no, a.content, a.adr_area, " +
                "       b.main_name || a.content content2 " +
                "  FROM chtcontact a, area b " +
                " WHERE a.chart_no = ? " +
                "   AND a.adr_area = b.area_code(+) " +
                "ORDER BY a.contact_no ";

        EntityFactory chtContactEntity = new EntityFactory(con, queryString);
        return chtContactEntity.findMultiple(new Object[]{chartNo});
    }

    public Map<String, Object> getPhoneNoByChartNo(int chartNo) {
        List<Map<String, Object>> objects;        
        Map<String, Object> result = new LinkedHashMap<>();

        result.put("home_tel", null);
        result.put("mobile", null);
        result.put("address", null);

        try {
            objects = queryChtContactByChartNo(chartNo);
            Optional<Object> content;            

            // 取得家裡電話
            content = objects.stream()
                    .filter(map -> (map.get("contact_no").equals("HTEL")))
                    .map(map -> map.get("content"))
                    .findAny();

            if (content.isPresent()) {
                result.put("home_tel", content.get());
            }

            // 取得手機號碼
            content = objects.stream()
                    .filter(map -> (map.get("contact_no").equals("MOBILE")))
                    .map(map -> map.get("content"))
                    .findAny();

            if (content.isPresent()) {
                result.put("mobile", content.get());
            }

            // 取得住址 content2
            content = objects.stream()
                    .filter(map -> (map.get("contact_no").equals("ADDR")))
                    .map(map -> map.get("content2"))
                    .findAny();

            if (content.isPresent()) {
                result.put("address", content.get());
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }


    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            ChtContact chtContact = new ChtContact(myConnection);

            System.out.println("\nChtContact.queryChtContactByChartNo chartNo=912473 JsonArray: " +
                    MapUtil.listMapToJsonArray(chtContact.queryChtContactByChartNo(912473)));

            System.out.println("\nChtContact.getPhoneNoByChartNo chartNo=912473 JsonObject: " +
                    MapUtil.mapToJsonObject(chtContact.getPhoneNoByChartNo(912473)));


        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}

