package model;

import library.utility.EntityFactory;
import library.utility.JDBCUtilities;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import static library.utility.MapUtil.castToLong;

/**
 * Created by jeffy on 2017/7/26.
 */
public class SeqPadSession {
    private Connection con;

    public SeqPadSession(Connection con) {
        this.con = con;
    }

    public long getSeqPadSessionNextVal() throws SQLException {
        Map<String, Object> map;

        String queryString =
                "SELECT seqpadsession.nextval " +
                "  FROM dual ";

        EntityFactory seqPadSessionNextValEntity = new EntityFactory(con, queryString);
        map = seqPadSessionNextValEntity.findSingle(new Object[]{});
        return castToLong(map.get("nextval"));
    }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();

        try {
            myConnection = jdbcUtil.getConnection();
            SeqPadSession seqPadSession = new SeqPadSession(myConnection);
            System.out.println("SeqPadSession.getSeqPadSessionNextVal: " + seqPadSession.getSeqPadSessionNextVal());
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}