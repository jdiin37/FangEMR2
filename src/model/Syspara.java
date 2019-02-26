package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2017/10/11.
 */
public class Syspara {
    private Connection con;

    public Syspara(Connection con) {
        this.con = con;
    }

    public Map<String, Object> querySysparaByNo(String no) throws SQLException {
        String queryString =
                "SELECT a.no, a.name, a.value " +
                "  FROM syspara a " +
                " WHERE no = ? ";

        EntityFactory sysparaEntity = new EntityFactory(con, queryString);
        return sysparaEntity.findSingle(new Object[]{no});
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            Syspara syspara = new Syspara(myConnection);

            System.out.println("\nSyspara.querySysparaByNo no='HOSPNAME' Map: " +
                    syspara.querySysparaByNo("HOSPNAME"));

            System.out.println("\nSyspara.querySysparaByNo no='HOSPNAME' JsonObject: " +
                    MapUtil.mapToJsonObject(syspara.querySysparaByNo("HOSPNAME")));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}