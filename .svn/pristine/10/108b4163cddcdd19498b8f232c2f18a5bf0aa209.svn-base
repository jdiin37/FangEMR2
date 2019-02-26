package model;

import library.dateutility.DateUtil;
import library.utility.EntityFactory;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static library.utility.MapUtil.castToInt;

/**
 * Created by Demon on 2018/02/05.
 */
public class LabReport {
    private Connection con;

    public LabReport(Connection con) {
        this.con = con;
    }

//    public Map<String, Object> queryLabVisitedBychartNo(int chartNo) throws SQLException {
//        String queryString =
//                "SELECT COUNT(*) count " +
//                "  FROM labrecordm a " +
//                " WHERE a.chart_no = ? " +
//                "   AND a.report_date IS NOT NULL ";
//
//        EntityFactory labRecordEntity = new EntityFactory(con, queryString);
//        return labRecordEntity.findSingle(new Object[]{chartNo});
//    }

//    public Map<String, Object> queryLabVisitedBychartNoAndYears(String startDate, String endDate, int chartNo) throws SQLException {
//        String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
//        String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
//        String queryString =
//                "SELECT COUNT(*) count " +
//                "  FROM labrecordm a " +
//                " WHERE a.chart_no = ? " +
//                "   AND a.lab_date BETWEEN to_date(?, 'YYYYMMDD') AND to_date(?, 'YYYYMMDD') " +
//                "   AND a.report_date IS NOT NULL ";
//
//        EntityFactory labRecordEntity = new EntityFactory(con, queryString);
//        return labRecordEntity.findSingle(new Object[]{chartNo, adStartDate, adEndDate});
//    }

    public Map<String, Object> queryEnterqryLabRecordm( String LabReportNo) throws SQLException {
      
        // String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
        //String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
        String queryString =
                "	SELECT "+
				"	lab_reportno, chart_no, pt_name, pt_sex sex, DECODE(pt_sex, 1, '男', '女') pt_sex,"+
				"		pt_type, lab_date, res_date, report_date, pt_source, "+ 
				"		division, bed_unit, bed_no, case_type, dr_id, ns_id, diagnose, "+
				"		print_flag, conf_date, "+
				"		req_date, "+ 
				"		sample_doc, conf_oper, report_oper, memo "+
		    	"FROM labrecordm "+
			    "WHERE lab_reportno = ? "+
			    "UNION "+
		    	"SELECT req_no lab_reportno, TO_CHAR(chart_no) , NULL , NULL, NULL, "+
	    		"       NULL, NULL, NULL, NULL, inp_opd pt_source, "+
	    		"       NULL, NULL, bed_clinic bed_no, NULL, doctor_no dr_id, NULL, NULL, "+
	    		"       0, TO_DATE(TO_CHAR(to_number(SUBSTR(report_date),1,3)+1911)||SUBSTR(report_date,4,4),'YYYY/MM/DD') conf_date, "+ 
	    		"       TO_DATE(TO_CHAR(to_number(SUBSTR(req_datetime),1,3))+1911)||SUBSTR(req_datetime,4,10),'YYYY/MM/DD HH24MISS')  req_date, "+ 
	    		"       NULL, REPORT_CLERK,"+
	    		"       NULL, NULL" +   
	    		"	FROM clinrpt "+
		    	"	WHERE req_no = ?  ";
        //queryEnterqryItem(chartNo,LabReportNo);

        EntityFactory labReportNoEntity = new EntityFactory(con, queryString);
        return labReportNoEntity.findSingle(new Object[]{LabReportNo,LabReportNo});
    }

    public List<Map<String, Object>> queryEnterqryItem( int chartNo,String LabReportNo,String LabReportNo1) throws SQLException {
         boolean is_query=false;
         Map<String, Object> object;
         String report = "";
         
         //if (! is_query) {
         String queryString ="SELECT report "+
                             " FROM clinrpt "+
    	   		             " WHERE chart_no =? "+
                             " AND req_no = ? "+
                             " union "+
                             " select lab_report  report "+
                             " from labrecordo "+
                             //" where chart_no=? "+
                             " where lab_reportno=? ";
                             
         // :main.lab_reportno  
                    EntityFactory labclinrptEntity = new EntityFactory(con, queryString);
                   //return labclinrptEntity.findSingle(new Object[]{LabReportNo});
                    object = labclinrptEntity.findSingle(new Object[]{chartNo,LabReportNo,LabReportNo1});           
                   if(object.size() > 0) {     
                	  System.out.println("111 have data");
                	  return labclinrptEntity.findMultiple(new Object[]{chartNo,LabReportNo,LabReportNo1});
                   }
                   else{
                	  // System.out.println("222");
                     return enterLabRecordd(chartNo,LabReportNo);
                   }
                   // }     
         //return labclinrptEntity.findSingle(new Object[]{LabReportNo});
                    //return labReport.enterLabRecordd(LabReportNo);
    }  
    public Map<String, Object> enterReporSet( String LabReportNo) throws SQLException {
    	   
    //    String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
     //   String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
      String queryString =
                "	SELECT  rowid, report_id, report_seq, report_itemtype, report_item, report_title,"+
		        "           report_ps1, report_ps2, report_text_after"+
                "     FROM reportset"+
                "     WHERE report_id = SUBSTR(?, 7, 2)"+
                "     ORDER BY report_seq";
               
           EntityFactory enterReportSetEntity = new EntityFactory(con, queryString);
        return enterReportSetEntity.findSingle(new Object[]{LabReportNo});
    }
    public List<Map<String, Object>> enterLabRecordd( int chartNo,String LabReportNo) throws SQLException {
 	   
        //    String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
         //   String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
          String queryString =
        		  "SELECT assay_id, result_val, unit, lab_status, instr_kind,"+
                          " assay_judgetype, result_status,report_normalrange,to_number(to_char(a.report_date,'yyyymmdd'))-19110000  report_date , "+
                          " case when to_number(substr(to_char(to_number(c.birth_date)+19110000),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))>6 and sex=1 then SUBSTR(report_normalrange,1,decode(INSTR(report_normalrange,'|'),0,100,INSTR(report_normalrange,'|'))-1) "+ 
                          " when to_number(substr(to_char(to_number(c.birth_date)+19110000),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))>6 and sex=2 then SUBSTR(report_normalrange,INSTR(report_normalrange,'|')+1,100) "+
                          " when to_number(substr(to_char(to_number(c.birth_date)+19110000),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))<6  then SUBSTR(report_normalrange,INSTR(report_normalrange,'|')+1,100) "+
                          " end  normal_val "+                                  
                     " FROM labrecordd a ,labrecordm b, chart c"+
   		            " WHERE c.chart_no=?"+
                    " AND b.chart_no=c.chart_no"+
   		            " AND b.lab_reportno = ? "+
   		            " AND a.lab_reportno=b.lab_reportno"+
   			        " AND rpt_flag = '1' "+
   		            " ORDER BY a.assay_id";

                   
            EntityFactory enterLabRecorddEntity = new EntityFactory(con, queryString);
            return enterLabRecorddEntity.findMultiple(new Object[]{chartNo,LabReportNo});
        }
    
    public List<Map<String, Object>> queryOneItemLabVal( int ChartNo,String LabAssayId,String Startdate,String Enddate) throws SQLException {
  	   
        //    String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
         //   String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
          String queryString =
                    "SELECT assay_id, result_val, unit, lab_status, instr_kind,"+
                    " assay_judgetype, result_status,report_normalrange, "+
                    " case when to_number(substr(to_date(to_number(c.birth_date)+19110000,'yyyymmdd'),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))>6 and sex=1 then SUBSTR(report_normalrange,1,decode(INSTR(report_normalrange,'|'),0,100,INSTR(report_normalrange,'|'))-1) "+
                    "  when to_number(substr(to_date(to_number(c.birth_date)+19110000,'yyymmdd'),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))>6 and sex=2 then SUBSTR(report_normalrange,INSTR(report_normalrange,'|')+1,100) "+
                    "  when to_number(substr(to_date(to_number(c.birth_date)+19110000,'yyymmdd'),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))<6  then SUBSTR(report_normalrange,INSTR(report_normalrange,'|')+1,100) "+
                    " end  normal_val"+
                    " FROM labrecordd a ,labrecordm b,chart c"+
   		            " WHERE c.chartno=chartNo" +
   		            " AND b.chartNo=chartNo "+
   		            "AND  a.lab_reportNo=b.lab_reportNo"+
   		            "AND b.report_date BETWEEN to_date(TO_NUMber(Startdate)+19110000, 'YYYYMMDD') AND to_date(TO_NUMber(Enddate)+19110000, 'YYYYMMDD')  " +
                    "AND a.lab_reportno=b.lab_reportno"+
   		            "AND assay_id = LabAssayID "+
   			        "AND rpt_flag = '1' ";
   		           

                   
            EntityFactory enterLabRecorddEntity = new EntityFactory(con, queryString);
            return enterLabRecorddEntity.findMultiple(new Object[]{ChartNo,LabAssayId,Startdate,Enddate});
        }
    public List<Map<String, Object>> queryLabDdataByChartNoLabItems(List<Object> objects) throws SQLException {
//System.out.println("OBJECT="+objects);
        String queryString =
        		"SELECT assay_id, result_val, unit, lab_status, instr_kind,"+
                        " assay_judgetype, result_status,report_normalrange,to_number(to_char(a.report_date,'yyyymmdd'))-19110000  report_date, "+
                        " case when to_number(substr(to_char(to_number(c.birth_date)+19110000),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))>6 and sex=1 then SUBSTR(report_normalrange,1,decode(INSTR(report_normalrange,'|'),0,100,INSTR(report_normalrange,'|'))-1) "+ 
                        " when to_number(substr(to_char(to_number(c.birth_date)+19110000),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))>6 and sex=2 then SUBSTR(report_normalrange,INSTR(report_normalrange,'|')+1,100) "+
                        " when to_number(substr(to_char(to_number(c.birth_date)+19110000),1,3))-to_number(substr(to_char(a.report_date,'yyyymmdd'),1,3))<6  then SUBSTR(report_normalrange,INSTR(report_normalrange,'|')+1,100) "+
                        " end  normal_val "+                                  
                        " FROM labrecordd a ,labrecordm b,chart c "+
       		            " WHERE c.chart_No= ? "+
       		            " AND C.chart_no=b.chart_no"+
       		            " AND b.report_date BETWEEN to_date(TO_NUMber(?)+19110000, 'YYYYMMDD') AND to_date(TO_NUMber(?)+19110000, 'YYYYMMDD')  " +
                        " AND a.lab_reportno=b.lab_reportno "+
       		            " AND rpt_flag = '1' "  +      // total allow 40 labitems placeholder for in clause
                        " AND a.assay_id in ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
                        "                   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) " + 
                        " ORDER BY a.assay_id, a.report_date";
                        
        System.out.println("queryString="+queryString);
        EntityFactory queryLabDdataByChartNoLabItemsEntity = new EntityFactory(con, queryString);
        return  queryLabDdataByChartNoLabItemsEntity.findMultiple(objects.toArray());
//        if(objects.size() > 0)
//        	//System.out.println("有資料"+objects);
//        else
//        	//System.out.println("無資料");
//        return queryLabDdataByChartNoLabItemsEntity.findMultiple(objects.toArray());
        
    }
     

    public List<Map<String, Object>> enterqryGermAntibio( String LabReportNo,String germGroup,String rptType) throws SQLException {
  	   
        //    String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
         //   String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
          String queryString =
                    "	SELECT anti_result1, anti_result2, anti_result3,"+
					"	anti_flag1, anti_flag2, anti_flag3, germ_name "+
		        	"  FROM germ_antibio, germdat "+
			        " WHERE anti_code = germ_id "+
				    " AND germ_type = 'A' "+
				    " AND lab_reportno = ? "+
				    " AND germ_group = ? "+
				    " AND rpt_type = ?"+
				    "AND (NVL(anti_result1, ' ') <> ' ' OR NVL(anti_result2, ' ') <> ' ' OR NVL(anti_result3, ' ') <> ' ') "+
	                "	ORDER BY germ_name";
            EntityFactory enterqryGermAntibioEntity = new EntityFactory(con, queryString);
            return enterqryGermAntibioEntity.findMultiple(new Object[]{LabReportNo,germGroup,rptType});
        }
    public List<Map<String, Object>> pEnterqryGermResultm( String LabReportNo,String germGroup,String rptType) throws SQLException {
   	   
        //    String adStartDate = DateUtil.rocDateStringToADDateString(startDate);
         //   String adEndDate = DateUtil.rocDateStringToADDateString(endDate);
          String queryString =
                   	"	select	lab_reportno, germ_group, rpt_type, chart_no, pt_name,"+
					"	pt_type, lab_date, res_date, report_date, pt_source, antibio_used, sample_date,"+
					"	division, bed_unit, bed_no, case_type, dr_id, ns_id, diagnose,"+
					"	print_flag, conf_date, req_date, sample_doc, conf_oper, report_oper,"+
					"	germ_name1, germ_qty1, germ_doc1, germ_name2, germ_qty2, germ_doc2,"+
					"	germ_name3, germ_qty3, germ_doc3, report_text,"+
					"	epi_cell, pmn, resistance_markers1, resistance_markers2, resistance_markers3,"+
					"	resistance_germ1, resistance_germ2, resistance_germ3"+
					"	FROM germ_resultm "+
					"	WHERE lab_reportno = ?"+
					"		AND germ_group = ?"+
					"		AND rpt_type = ?";
          
            System.out.println(queryString);
            EntityFactory pEnterqryGermResultmEntity = new EntityFactory(con, queryString);
            return pEnterqryGermResultmEntity.findMultiple(new Object[]{LabReportNo,germGroup,rptType});
        }

    public static void main(String[] args) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String resultStrng;

        try {
            myConnection = jdbcUtil.getConnection();
            LabReport labReport = new LabReport(myConnection);
            	
            int chartNo = 912473;
            int years = 105;
            String reqNo ="021110NE00001";
            String labReportNo ="990616A800008";
            String germGroup="2285";
            String  rptType="B";
            List<Map<String, Object>> result = labReport.queryEnterqryItem(chartNo,reqNo,reqNo);
            
            System.out.printf("\nLabReport.queryEnterqryItem LabReportNo=%s %s  %s",
           		labReportNo, MapUtil.listMapToJsonArray(labReport.queryEnterqryItem(chartNo,reqNo,reqNo)).toString());

           
            System.out.printf("\nLabReport.queryEnterqryLabRecordm chartNo= %s reqNo=%s : ",
           	chartNo,reqNo);
         //   System.out.printf(MapUtil.listMapToJsonArray(labReport.queryEnterqryItem(LabReportNo)).toString());
//            System.out.printf("\nLabReport.queryEnterqryLabRecordm LabReportNo=%s ",
//            		LabReportNo, MapUtil.listMapToJsonArray(labReport.queryEnterqryLabRecordm(LabReportNo)).toString());
//pEnterqryGermResultm( String LabReportNo,String germGroup,String rptType) throws SQLException {
        	   
            System.out.printf("\nLabReport.pEnterqryGermResultm LabReportNo= %s ",
            		chartNo,labReportNo, MapUtil.listMapToJsonArray(labReport.pEnterqryGermResultm(labReportNo,germGroup,rptType)).toString());
             labReportNo ="990616A800008";
            
            Object[] objects = new Object[] {912473,"0960101","0970101", "GOT","GPT","Albumin","MCV","WBC(H)", };
            List<Object> nullObjects = new ArrayList<>();
            for (int i = objects.length; i < 43; i++) {
                nullObjects.add(null);
            }
            List<Object> inObjects = new ArrayList<>();
            inObjects.addAll(Arrays.asList(objects));
            inObjects.addAll(nullObjects);

            System.out.println("\ninObjects : " + inObjects.toString());
            System.out.println("\nLabReport.queryLabDdataByChartNoLabItems List Map: " +
                    labReport.queryLabDdataByChartNoLabItems(inObjects));

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) {
                JDBCUtilities.closeConnection(myConnection);
            }
        }
    }
}



