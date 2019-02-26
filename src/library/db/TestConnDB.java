package library.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;


public class TestConnDB {

	public static void main(String[] args) throws Exception {
	    queryOpdctl();
	}	
	
	public static void queryOpdctl() throws Exception {
		ConnDB conn = new ConnDB();
        try {
            Connection con = conn.getConnectionByJDBC();
            Statement pstmt =con.createStatement();
            String sql = "select seq_no, mark, value " + " from opdctl";
			ResultSet rs = pstmt.executeQuery(sql);
			while (rs.next()) {
			    System.out.println(rs.getString("seq_no") + ";" + rs.getString("mark") + ";" + rs.getString("value"));
			}
			rs.close();
			pstmt.close();
			con.close();
            con.close();
		} catch (Exception e) {
		    System.out.println(e.getMessage());
		}
	}	

    public static void queryOpdctl2() throws Exception {
        ConnDB conn = new ConnDB();
        try {
            Connection con = conn.getConnectionByJNDI();
            Statement pstmt =con.createStatement();
            String sql = "select seq_no, mark, value " + " from opdctl";
            ResultSet rs = pstmt.executeQuery(sql);
            while (rs.next()) {
                System.out.println(rs.getString("seq_no") + ";" + rs.getString("mark") + ";" + rs.getString("value"));
            }
            rs.close();
            pstmt.close();
            con.close();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }	
	
	
}
