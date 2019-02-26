package model;

import library.dateutility.DateUtil;
import library.dateutility.Utility;
import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by demon on 2018/3/1.
 */
public class Opdacnt {
	private Connection con;

	public Opdacnt(Connection con) {
		this.con = con;
	}

	// 取得門轉住的醫令
	public List<Map<String, Object>> queryOpdacntByPatinp(int chartNo, int serno) throws SQLException {
		String queryString = "SELECT view_date,chart_no,duplicate_no from patopd where chart_no = ? and serno = ?";
		EntityFactory patopdEntity = new EntityFactory(con, queryString);
		HashMap<String, Object> patopdMap = new HashMap<String, Object>();
		patopdMap = (HashMap<String, Object>) patopdEntity.findSingle(new Object[] { chartNo, serno });
		String viewDate = "";
		int duplicateNo = 0;
		if (patopdMap != null && patopdMap.size() > 0) {
			viewDate = patopdMap.get("view_date").toString();
			duplicateNo = Integer.valueOf(patopdMap.get("duplicate_no").toString());
		}
		System.out.println(viewDate+","+ chartNo+","+ duplicateNo);
		//if (viewDate != null && !viewDate.equals("")) {
			return queryOpdacntByViewDateChartNoDuplicateNo(viewDate, chartNo, duplicateNo);
//		} else
//			return null;

	}

	public List<Map<String, Object>> queryOpdacntByViewDateChartNoDuplicateNo(String viewDate, int chartNo,
			int duplicateNo) throws SQLException {

		String queryString = "SELECT a.chart_no, a.view_date, a.duplicate_no, a.rec_count, a.code, "
				+ "       b.full_name, b.full_name_c, b.unit, b.s_unit, a.identify_no, "
				+ "       a.acnt_no, a.price_type, a.start_date, a.start_time, a.end_date, a.end_time, "
				+ "       a.qty, a.unuse, e.name_c unuse_name_c, e.name_e unuse_name_e, "
				+ "       a.use, c.name_c use_name_c, c.name_e use_name_e, a.usetime, "
				+ "       a.day, a.tqty,  a.self, a.discount, a.comp_discount, a.amt, a.he_add_fee, "
				+ "       a.method, d.name_c method_name_c, d.name_e method_name_e, a.method1, a.method2, "
				+ "       a.emg, a.add_rate, a.office, a.stock, a.grind, "
				+ "       a.cashier, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.cashier) cashier_name, "
				+ "       a.order_datetime, a.doctor_no, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.doctor_no) doctor_name, "
				+ "       a.exec_datetime, a.exec_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.exec_clerk) exec_clerk_name, "
				+ "       a.report_datetime, a.report_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.report_clerk) report_clerk_name, "
				+ "       a.operation, a.req_no,  a.tqty, "
				+ "       a.keyin_datetime, a.keyin_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.keyin_clerk) keyin_clerk_name, "
				+ "       a.modify_datetime, a.modify_clerk, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.modify_clerk) modify_clerk_name, "
				+ "       a.grind,  " + "       a.cons_no, a.noexe_reason,  a.office1, "
				+ "       a.max_price_times, a.order_pos,  a.flow_speed, a.project_no, "
				+ "       a.dicom_flag, p.div_no, (SELECT b.div_name FROM division b WHERE b.div_no = p.div_no) div_name, "
				+ "       a.code_flag, a.code_flag_clerk, a.sentd_msg "
				+ "  FROM opdacnt a, price b, vuse c, method d, vunuse e ,patopd p " + " WHERE a.view_date= ? "
				+ "   AND a.chart_no = ? " + "   AND a.duplicate_no = ? " + "   AND a.view_date=p.view_date "
				+ "   AND a.chart_no =p.chart_no " + "   AND a.duplicate_no =p.duplicate_no "
				+ "   AND a.code = b.code(+) " + "   AND a.use = c.frequency_no(+) "
				+ "   AND a.method = d.method_no(+) " + "   AND a.use = e.frequency_no(+) " + " ORDER BY a.rec_count ";

		EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
		return inpcht2Entity.findMultiple(new Object[] { viewDate, chartNo, duplicateNo });
	}

	public List<Map<String, Object>> queryOpdacntBystartdateenddateChartNo(String startDate, String endDate,
			int chartNo, int medtype) throws SQLException {

		String queryString = "SELECT a.code, " + "       b.full_name, b.full_name_c,count(a.code) medcount "
				+ "  FROM opdacnt a, price b" + " WHERE a.view_date>= ? " + "   AND a.view_date<= ? "
				+ "   AND a.chart_no = ? " + "   AND a.code = b.code(+) " + "   AND a.acnt_no not in(1,4,60,53) "
				+ "   and  decode(b.price_type,1,1,2)=? " + "   group by a.code ,b.full_name, b.full_name_c"
				+ "  order by code,medcount  desc";
		EntityFactory opdacntEntity = new EntityFactory(con, queryString);
		return opdacntEntity.findMultiple(new Object[] { startDate, endDate, chartNo, medtype });
	}

	private String getSystemDate() {
		String nowDate = "";
		try {
			nowDate = DateUtil.getSystemROCDateTimeString(con).substring(0, 7);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return nowDate;
	}

	public List<Map<String, Object>> queryOpdacntByChartNoyear(int syear, int chartNo, int medtype)
			throws SQLException {
		// String yearsdate=year+"0101";
		// String yesredate=year+"1231";
		int totalDays = syear * 365;
		String sDate = null;
		String eDate = getSystemDate();
		System.out.println("e:" + eDate);
		try {
			sDate = Utility.computeDate(sDate, eDate, totalDays);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("s:" + sDate + "~e:" + eDate);
		// sDate = getPatopdMinViewDate(chartNo,sDate);
		String queryString = "SELECT a.code, " + "       b.full_name, b.full_name_c,count(a.code) medcount "
				+ "  FROM opdacnt a, price b" + " WHERE a.view_date>=?" + "   AND a.view_date<=?"
				+ "   AND a.chart_no = ? " + "   AND a.code = b.code(+) " + "   AND a.acnt_no not in(1,4,60,53) "
				+ "   and  decode(b.price_type,1,1,2)=? " + "   group by a.code ,b.full_name, b.full_name_c"
				+ "  order by code,medcount  desc";
		System.out.printf("\n" + queryString);

		EntityFactory opdacntEntity = new EntityFactory(con, queryString);
		return opdacntEntity.findMultiple(new Object[] { sDate, eDate, chartNo, medtype });
	}

	public List<Map<String, Object>> queryOpdacntByChartNoall(int chartNo, int medtype) throws SQLException {

		String queryString = "SELECT a.code, " + "       b.full_name, b.full_name_c,count(a.code) medcount  "
				+ "  FROM opdacnt a, price b" + " WHERE a.chart_no = ? " + "   AND a.code = b.code(+) "
				+ "   AND a.code=b.code " + "   AND a.acnt_no not in(1,4,60,53) "
				+ "   and  decode(b.price_type,1,1,2)=? " + "  group by a.code ,b.full_name, b.full_name_c"
				+ "  order by code,medcount  desc";
		EntityFactory opdacntEntity = new EntityFactory(con, queryString);
		return opdacntEntity.findMultiple(new Object[] { chartNo, medtype });
	}

	public List<Map<String, Object>> queryOpdacntshowdetaildate(String startdate, String enddate, int chartNo,
			String code) throws SQLException {

		String queryString = "SELECT a.chart_no, a.view_date, a.duplicate_no, a.rec_count, a.code, "
				+ "       b.full_name, b.full_name_c, b.unit, b.s_unit, a.identify_no, "
				+ "       a.acnt_no, a.price_type, a.start_date, a.start_time, a.end_date, a.end_time, "
				+ "       a.qty, a.unuse, e.name_c unuse_name_c, e.name_e unuse_name_e, "
				+ "       a.use, c.name_c use_name_c, c.name_e use_name_e, a.usetime, "
				+ "       a.day, a.tqty,  a.self, a.discount, a.comp_discount, a.amt, a.he_add_fee, "
				+ "       a.method, d.name_c method_name_c, d.name_e method_name_e, a.method1, a.method2, "
				+ "       a.emg, a.add_rate, a.office, a.stock, a.grind, "
				+ "       a.order_datetime, a.doctor_no, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.doctor_no) doctor_name, "
				+ "       a.exec_datetime, " + "       a.report_datetime," + "       a.operation, a.req_no, "
				+ "       a.keyin_datetime, a.keyin_clerk,  " + "       a.modify_datetime, a.modify_clerk, "
				+ "       a.cons_no, a.noexe_reason,  a.office1, "
				+ "       a.max_price_times, a.order_pos,  a.flow_speed, a.project_no, " + "       a.dicom_flag "
				+ "  FROM opdacnt a, price b, vuse c, method d, vunuse e  " + " WHERE a.view_date>= ? "
				+ "   and a.view_date<= ? " + "   AND a.chart_no = ? " + "   AND a.code = ? " + "   AND a.code=b.code "
				+ "   AND a.use = c.frequency_no(+) " + "   AND a.method = d.method_no(+) "
				+ "   AND a.unuse = e.frequency_no(+) " + " ORDER BY a.view_date";

		EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
		return inpcht2Entity.findMultiple(new Object[] { startdate, enddate, chartNo, code });
		// return inpcht2Entity.findSingle(new
		// Object[]{code,startdate,enddate,chartNo});

	}

	public List<Map<String, Object>> queryOpdacntshowdetailyear(int syear, int chartNo, String code)
			throws SQLException {
		int totalDays = syear * 365;
		String sDate = null;
		String eDate = getSystemDate();
		try {
			sDate = Utility.computeDate(sDate, eDate, totalDays);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("s:" + sDate + "~e:" + eDate);

		String queryString = "SELECT a.chart_no, a.view_date, a.duplicate_no, a.rec_count, a.code, "
				+ "       b.full_name, b.full_name_c, b.unit, b.s_unit, a.identify_no, "
				+ "       a.acnt_no, a.price_type, a.start_date, a.start_time, a.end_date, a.end_time, "
				+ "       a.qty, a.unuse, e.name_c unuse_name_c, e.name_e unuse_name_e, "
				+ "       a.use, c.name_c use_name_c, c.name_e use_name_e, a.usetime, "
				+ "       a.day, a.tqty,  a.self, a.discount, a.comp_discount, a.amt, a.he_add_fee, "
				+ "       a.method, d.name_c method_name_c, d.name_e method_name_e, a.method1, a.method2, "
				+ "       a.emg, a.add_rate, a.office, a.stock, a.grind, "
				+ "       a.order_datetime, a.doctor_no, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.doctor_no) doctor_name, "
				+ "       a.exec_datetime, " + "       a.report_datetime," + "       a.operation, a.req_no, "
				+ "       a.keyin_datetime, a.keyin_clerk,  " + "       a.modify_datetime, a.modify_clerk, "
				+ "       a.cons_no, a.noexe_reason,  a.office1, "
				+ "       a.max_price_times, a.order_pos,  a.flow_speed, a.project_no, " + "       a.dicom_flag "
				+ "  FROM opdacnt a, price b, vuse c, method d, vunuse e  " + " where a.view_date>=?"
				+ "   AND a.view_date<=?" + "   AND a.chart_no = ? " + "   AND a.code = ? " + "   AND a.code=b.code "
				+ "   AND a.use = c.frequency_no(+) " + "   AND a.method = d.method_no(+) "
				+ "   AND a.unuse = e.frequency_no(+) " + " ORDER BY a.view_date";

		EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
		return inpcht2Entity.findMultiple(new Object[] { sDate, eDate, chartNo, code });
		// return inpcht2Entity.findSingle(new
		// Object[]{code,startdate,enddate,chartNo});

	}

	public List<Map<String, Object>> queryOpdacntshowdetailall(int chartNo, String code) throws SQLException {

		String queryString = "SELECT a.chart_no, a.view_date, a.duplicate_no, a.rec_count, a.code, "
				+ "       b.full_name, b.full_name_c, b.unit, b.s_unit, a.identify_no, "
				+ "       a.acnt_no, a.price_type, a.start_date, a.start_time, a.end_date, a.end_time, "
				+ "       a.qty, a.unuse, e.name_c unuse_name_c, e.name_e unuse_name_e, "
				+ "       a.use, c.name_c use_name_c, c.name_e use_name_e, a.usetime, "
				+ "       a.day, a.tqty,  a.self, a.discount, a.comp_discount, a.amt, a.he_add_fee, "
				+ "       a.method, d.name_c method_name_c, d.name_e method_name_e, a.method1, a.method2, "
				+ "       a.emg, a.add_rate, a.office, a.stock, a.grind, "
				+ "       a.order_datetime, a.doctor_no, (SELECT b.emp_name FROM employee b WHERE b.emp_no = a.doctor_no) doctor_name, "
				+ "       a.exec_datetime, " + "       a.report_datetime," + "       a.operation, a.req_no, "
				+ "       a.keyin_datetime, a.keyin_clerk,  " + "       a.modify_datetime, a.modify_clerk, "
				+ "       a.cons_no, a.noexe_reason,  a.office1, "
				+ "       a.max_price_times, a.order_pos,  a.flow_speed, a.project_no, " + "       a.dicom_flag "
				+ "  FROM opdacnt a, price b, vuse c, method d, vunuse e  " + " WHERE a.chart_no = ? "
				+ "   AND a.code = ? " + "   AND a.code=b.code " + "   AND a.use = c.frequency_no(+) "
				+ "   AND a.method = d.method_no(+) " + "   AND a.unuse = e.frequency_no(+) " + " ORDER BY a.view_date";

		EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
		return inpcht2Entity.findMultiple(new Object[] { chartNo, code });
		// return inpcht2Entity.findSingle(new
		// Object[]{code,startdate,enddate,chartNo});

	}

	// public String getOPDate(int chartNo, int serno) throws SQLException {
	// String queryString =
	// "SELECT min(view_date) op_date " +
	// " FROM opdacnt " +
	// " WHERE chart_no = ? " +
	// " AND duplicate_no = ? " +
	// " AND acnt_no = 32 ";

	// EntityFactory inpcht2Entity = new EntityFactory(con, queryString);
	// Map<String, Object> map = inpcht2Entity.findSingle(new Object[]{chartNo,
	// serno});
	// return map.get("op_date") != null ? (String)map.get("op_date") : null;
	// }

	public static void main(String[] args) {
		String resultString;

		Connection myConnection = null;
		JDBCUtilities jdbcUtil = new JDBCUtilities();

		try {
			myConnection = jdbcUtil.getConnection();
			Opdacnt opdacnt = new Opdacnt(myConnection);

			int chartNo = 44530;
			int duplicateNo = 1;
			int medtype = 1;
			int serno = 716161;
			String startdate = "0930101";
			String enddate = "0941231";
			String viewdate = "0930101";
			String code = "MEDA";
			int syear = 1;
//			System.out.printf(
//					"\nOpdanct.queryOpdacntByviewdateChartNoduplicateNo viewdate= %s duplicateno=%s chartNo=%d   JsonArray:%s ",
//					viewdate, chartNo, duplicateNo,
//					MapUtil.listMapToJsonArray(
//							opdacnt.queryOpdacntByViewDateChartNoDuplicateNo(viewdate, chartNo, duplicateNo))
//							.toString());
//
//			System.out.printf(
//					"\nOpdanct.queryOpdacntBystartdateenddateChartNo startdate= %s enddate=%s chartNo=%d   JsonArray:%s ",
//					startdate, enddate, chartNo,
//					MapUtil.listMapToJsonArray(
//							opdacnt.queryOpdacntBystartdateenddateChartNo(startdate, enddate, chartNo, medtype))
//							.toString());
//			System.out.printf("\nOpdanct.queryOpdacntByChartNoall chartNo=%d medtype=%d  JsonArray:%s ", chartNo,
//					medtype, MapUtil.listMapToJsonArray(opdacnt.queryOpdacntByChartNoall(chartNo, medtype)).toString());
//			System.out.printf("\nOpdanct.queryOpdacntByChartNoyear: " + MapUtil
//					.listMapToJsonArray(opdacnt.queryOpdacntByChartNoyear(syear, chartNo, medtype)).toString());

			// System.out.printf("\nOpdanct.queryOpdacntshowdetail startdate= %s
			// enddate=%s chartNo=%d code=%s JsonArray:%s ",
			// startdate,enddate,chartNo ,code,
			// MapUtil.listMapToJsonArray(opdacnt.queryOpdacntshowdetail(startdate,enddate,chartNo,code)).toString());
			// startdate,enddate,chartNo ,code
			// ,MapUtil.listMapToJsonArray(opdacnt.queryOpdacntshowdetail(startdate,enddate,chartNo,code)).toString());

			// int chartNo=604334;
			// int syear=1;
			// int medtype=1;
			// String eyear="093";
//			System.out.printf("\nOpdanct.queryOpdacntByChartNoyear syear=%d chartNo=%d    JsonArray:%s ", syear,
//					chartNo,
//					MapUtil.listMapToJsonArray(opdacnt.queryOpdacntByChartNoyear(syear, chartNo, medtype)).toString());
//
//			System.out.printf(
//					"\nOpdanct.queryOpdacntshowdetaildate startdate= %s enddate=%s chartNo=%d code=%s   JsonArray:%s ",
//					startdate, enddate, chartNo, code,
//					MapUtil.listMapToJsonArray(opdacnt.queryOpdacntshowdetaildate(startdate, enddate, chartNo, code))
//							.toString());
//			System.out.printf("\nOpdanct.queryOpdacntshowdetailyear syear= %d chartNo=%d code=%s   JsonArray:%s ",
//					syear, chartNo, code,
//					MapUtil.listMapToJsonArray(opdacnt.queryOpdacntshowdetailyear(syear, chartNo, code)).toString());
//			System.out.printf("\nOpdanct.queryOpdacntshowdetailall  chartNo=%d code=%s   JsonArray:%s ", chartNo, code,
//					MapUtil.listMapToJsonArray(opdacnt.queryOpdacntshowdetailall(chartNo, code)).toString());
			System.out.printf("\nOpdanct.queryOpdacntByPatinp  chartNo=%d serno=%d   JsonArray:%s ", chartNo, serno,
					MapUtil.listMapToJsonArray(opdacnt.queryOpdacntByPatinp(chartNo, serno)).toString());

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
		} finally {
			if (myConnection != null) {
				JDBCUtilities.closeConnection(myConnection);
			}
		}
	}

}
