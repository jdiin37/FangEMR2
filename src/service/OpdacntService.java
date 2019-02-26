package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;

import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.Opdacnt;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2018/3/1.
 */
public class OpdacntService extends ServletAdapter {
	private List<Map<String, Object>> objects;
	private Map<String, Object> object;
	private JsonObject jsonObject = new JsonObject();
	private Opdacnt Opdacnt;

	public String getOpdacntByViewDateChartNoDuplicateNo(String viewDate, int chartNo, int duplicateNo) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntByViewDateChartNoDuplicateNo(viewDate, chartNo, duplicateNo);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getOpdacntBystartdateenddateChartNo(String startDate, String endDate, int chartNo, int medtype) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntBystartdateenddateChartNo(startDate, endDate, chartNo, medtype);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqueryOpdacntByChartNoyear(int syear, int chartNo, int medtype) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-syear, ChronoUnit.YEARS));
			String endDate = DateUtil.dateToROCDateString(LocalDate.now());

			tempObjects = Opdacnt.queryOpdacntBystartdateenddateChartNo(startDate, endDate, chartNo, medtype);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqueryOpdacntByChartNoall(int chartNo, int medtype) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntByChartNoall(chartNo, medtype);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqueryOpdacntshowdetaildate(String startdate, String enddate, int chartNo, String code) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntshowdetaildate(startdate, enddate, chartNo, code);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqueryOpdacntshowdetailyear(int syear, int chartNo, String code) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-syear, ChronoUnit.YEARS));
			String endDate = DateUtil.dateToROCDateString(LocalDate.now());
			tempObjects = Opdacnt.queryOpdacntshowdetaildate(startDate, endDate, chartNo, code);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqueryOpdacntshowdetailall(int chartNo, String code) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntshowdetailall(chartNo, code);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqqueryOpdacntByViewDateChartNoDuplicateNo(String viewdate, int chartNo, int duplicateno) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntByViewDateChartNoDuplicateNo(viewdate, chartNo, duplicateno);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	public String getqueryOpdacntByPatinp(int chartNo, int serno) {
		List<Map<String, Object>> tempObjects = new ArrayList<>();
		try {
			tempObjects = Opdacnt.queryOpdacntByPatinp(chartNo, serno);

			jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(tempObjects));

		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
			jsonObject = MapUtil.getFailureResult(ex.getMessage());
		}

		return jsonObject.toString();
	}

	@Override
	public String run(JsonObject parametersJsObj) {
		Connection myConnection = null;
		JDBCUtilities jdbcUtil = new JDBCUtilities();
		String result = null;

		try {
			myConnection = jdbcUtil.getConnection();
			Opdacnt = new Opdacnt(myConnection);
			// String viewdate = parametersJsObj.get("viewdate").getAsString();
			// int duplicateNo = parametersJsObj.get("duplicateNo").getAsInt();
			String method = parametersJsObj.get("method").getAsString();
			// String startdate =
			// parametersJsObj.get("startdate").getAsString();
			// String enddate = parametersJsObj.get("enddate").getAsString();
			// String code = parametersJsObj.get("code").getAsString();

			// get opdacnt state by viewdate,chart_no, duplicateNo
			if (method.equals("getOpdacntByViewDateChartNoDuplicateNo")) {
				String viewdate = parametersJsObj.get("viewdate").getAsString();
				int chartNo = parametersJsObj.get("chartNo").getAsInt();
				int duplicateNo = parametersJsObj.get("duplicateNo").getAsInt();

				result = getOpdacntByViewDateChartNoDuplicateNo(viewdate, chartNo, duplicateNo);
			}

			// get opdacnt by startdate,enddate,chart_no
			if (method.equals("getOpdacntBystartdateenddateChartNo")) {
				int chartNo = parametersJsObj.get("chartNo").getAsInt();
				String startdate = parametersJsObj.get("startdate").getAsString();
				String enddate = parametersJsObj.get("enddate").getAsString();
				int medtype = parametersJsObj.get("medtype").getAsInt();

				result = getOpdacntBystartdateenddateChartNo(startdate, enddate, chartNo, medtype);
			}
			// get opdacnt by chart_no
			if (method.equals("getqueryOpdacntByChartNoall")) {
				int chartNo = parametersJsObj.get("chartNo").getAsInt();
				int medtype = parametersJsObj.get("medtype").getAsInt();

				result = getqueryOpdacntByChartNoall(chartNo, medtype);
			}
			// get opdacnt by chart_no
			if (method.equals("getqueryOpdacntByChartNoyear")) {
				int chartNo = parametersJsObj.get("chartNo").getAsInt();
				int syear = parametersJsObj.get("syear").getAsInt();
				int medtype = parametersJsObj.get("medtype").getAsInt();

				result = getqueryOpdacntByChartNoyear(syear, chartNo, medtype);
			}
			// get opdacnt by chart_no
			if (method.equals("getqueryOpdacntshowdetaildate")) {
				String startdate = parametersJsObj.get("startdate").getAsString();
				String enddate = parametersJsObj.get("enddate").getAsString();
				int chartNo = parametersJsObj.get("chartNo").getAsInt();

				String code = parametersJsObj.get("code").getAsString();

				result = getqueryOpdacntshowdetaildate(startdate, enddate, chartNo, code);
			}
			if (method.equals("getqueryOpdacntshowdetailyear")) {
				int syear = parametersJsObj.get("syear").getAsInt();
				int chartNo = parametersJsObj.get("chartNo").getAsInt();

				String code = parametersJsObj.get("code").getAsString();

				result = getqueryOpdacntshowdetailyear(syear, chartNo, code);
			}
			if (method.equals("getqueryOpdacntshowdetailall")) {
				// String startdate =
				// parametersJsObj.get("startdate").getAsString();
				// String enddate =
				// parametersJsObj.get("enddate").getAsString();
				int chartNo = parametersJsObj.get("chartNo").getAsInt();

				String code = parametersJsObj.get("code").getAsString();

				result = getqueryOpdacntshowdetailall(chartNo, code);
			}
			if (method.equals("getqqueryOpdacntByViewDateChartNoDuplicateNo")) {
				String viewdate = parametersJsObj.get("viewdate").getAsString();
				int chartNo = parametersJsObj.get("chartNo").getAsInt();
				int duplicateno = parametersJsObj.get("duplicateno").getAsInt();

				result = getqqueryOpdacntByViewDateChartNoDuplicateNo(viewdate, chartNo, duplicateno);
			}
			if (method.equals("getqueryOpdacntByPatinp")) {
				int chartNo = parametersJsObj.get("chartNo").getAsInt();
				int serno = parametersJsObj.get("serno").getAsInt();

				result = getqueryOpdacntByPatinp(chartNo, serno);
			}
		} catch (SQLException ex) {
			JDBCUtilities.printSQLException(ex);
		} finally {
			if (myConnection != null) {
				JDBCUtilities.closeConnection(myConnection);
			}
		}

		return result;
	}

	public static void main(String[] args) {
		JsonObject jsonObject = new JsonObject();
		// Map<String, String> map = new LinkedHashMap<>();
		OpdacntService OpdacntService = new OpdacntService();
		String resultStrng;
		int chartNo = 604334;
		int duplicateNo = 1;
		String startdate = "0930101";
		String enddate = "0941231";
		String viewdate = "0930101";
		String syear = "093";
		String eyear = "093";
		String code = "MEDA";

		jsonObject = new JsonObject();
		jsonObject.addProperty("viewdate", "0930101");
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);
		// jsonObject.addProperty("viewdate", "0930101");
		// jsonObject.addProperty("startdate", "0930101");
		// jsonObject.addProperty("enddate", "0931231");
		// jsonObject.addProperty("code", "MEDA");

		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("duplicateNo", 1);
		jsonObject.addProperty("medtype", 1);

		jsonObject.addProperty("method", "getOpdacntByViewDateChartNoDuplicateNo");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		// jsonObject = new JsonObject();
		// jsonObject.addProperty("empNo", "ORCL");
		// jsonObject.addProperty("sessionID", 1);
		// jsonObject.addProperty("viewdate","0930101");
		// jsonObject.addProperty("chartNo", 604334);
		// jsonObject.addProperty("duplicateNo", 1);

		// jsonObject.addProperty("startdate", "0930101");
		// jsonObject.addProperty("enddate", "0931231");

		System.out.println("\nopdacntService.run getOpdacntByViewDateChartNoDuplicateNo chartNo=604334 duplicate_No=1 :"
				+ resultStrng);

		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);
		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("duplicateNo", 1);
		jsonObject.addProperty("startdate", "0930101");
		jsonObject.addProperty("enddate", "0931231");
		jsonObject.addProperty("viewdate", "0930101");
		jsonObject.addProperty("code", "MEDA");
		jsonObject.addProperty("medtype", 1);

		jsonObject.addProperty("method", "getOpdacntBystartdateenddateChartNo");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		System.out.println("\nopdacntService.run getOpdacntBystartdateenddateChartNo chartNo=604334 duplicateNo=1 :"
				+ resultStrng);
		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("startdate", "0930101");
		jsonObject.addProperty("enddate", "0931231");
		jsonObject.addProperty("code", "MEDA");
		jsonObject.addProperty("method", "getqueryOpdacntshowdetail");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		// System.out.println("\nopdacntService.run getqueryOpdacntshowdetail
		// chartNo=604334 duplicateNo=1 :" + resultStrng);
		// jsonObject.addProperty("chartNo", 604334);

		jsonObject.addProperty("syear", "1");
		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("medtype", 1);

		jsonObject.addProperty("method", "getqueryOpdacntByChartNoyear");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		System.out.println(
				"\nopdacntService.run getqueryOpdacntByChartNoyear chartNo=604334 duplicateNo=1 :" + resultStrng);
		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		// jsonObject.addProperty("syear", "093");
		// jsonObject.addProperty("eyear", "093");
		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("medtype", 1);
		jsonObject.addProperty("method", "getqueryOpdacntByChartNoall");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		System.out.println(
				"\nopdacntService.run getqueryOpdacntByChartNoall chartNo=604334 duplicateNo=1 :" + resultStrng);

		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("startdate", "0930101");
		jsonObject.addProperty("enddate", "0931231");
		jsonObject.addProperty("code", "MEDA");
		jsonObject.addProperty("method", "getqueryOpdacntshowdetaildate");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		// jsonObject= new JsonObject();
		// System.out.println("\nopdacntService.run getqueryOpdacntshowdetail
		// chartNo=604334 duplicateNo=1 :" + resultStrng);
		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("syear", 1);
		jsonObject.addProperty("code", "MEDA");

		jsonObject.addProperty("method", "getqueryOpdacntshowdetailyear");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);

		// jsonObject= new JsonObject();
		// System.out.println("\nopdacntService.run getqueryOpdacntshowdetail
		// chartNo=604334 duplicateNo=1 :" + resultStrng);
		jsonObject = new JsonObject();
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		jsonObject.addProperty("chartNo", 604334);

		jsonObject.addProperty("code", "MEDA");

		jsonObject.addProperty("method", "getqueryOpdacntshowdetailall");
		resultStrng = OpdacntService.run(jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("duplicateNo", 1);
		jsonObject.addProperty("medtype", 1);

		resultStrng = OpdacntService.run(jsonObject);
		jsonObject.addProperty("method", " getqqueryOpdacntByViewDateChartNoDuplicateNo");
		// resultStrng = OpdacntService.run(jsonObject);
		jsonObject.addProperty("empNo", "ORCL");
		jsonObject.addProperty("sessionID", 1);

		jsonObject.addProperty("viewdate", "0930101");
		jsonObject.addProperty("chartNo", 604334);
		jsonObject.addProperty("duplicateno", 1);

		// System.out.println("\nParameters JsonObject string: " + jsonObject);
		System.out.println("\nParameters JsonObject string: " + jsonObject);
		System.out.println(
				"\nopdacntService.run  getqqueryOpdacntByViewDateChartNoDuplicateNo chartNo=604334 duplicate_No=1 :"
						+ resultStrng);

	}

}
