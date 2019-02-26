package library.dateutility;

import static org.junit.Assert.*;
import java.text.ParseException;
import java.util.Date;
import org.junit.Test;



public class UtilityTest {

	@Test
	public void testTruncate() {
		try {
			Date ans = Utility.truncate(Transform.ROCDateTimeStringToDate("10601021020"));
			Date a = Transform.ROCDateStringToDate("1060102");
			assertEquals(a, ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}
	
	@Test
	public void testaddDayToDate() {
		String ans = Utility.addDayToDate("1050101", 10);
		assertEquals("1050111", ans);
	}

	
	@Test
	public void testaddMonthToDate() {
		String ans = Utility.addMonthToDate("1050130", 1);
		assertEquals("1050229", ans);
	}
	
	
	@Test
	public void testgetRealAge() throws Exception {
		int ans = Utility.getRealAge("1040130","1050130");
		assertEquals(1, ans);
	}
	
	@Test
	public void testgetRealMonth() throws Exception {
		int ans = Utility.getRealMonth("1040130","1050130");
		assertEquals(12, ans);
	}
	
	@Test
	public void testdaysBetween() throws Exception {
		int ans = Utility.daysBetween("1040130","1050130");
		assertEquals(365, ans);
	}		
	
	@Test
	public void testgetLastMonth() throws Exception {
		String ans = Utility.getLastMonth("10501");
		assertEquals("10412", ans);
	}
	
	@Test
	public void testgetNextMonth() throws Exception {
		String ans = Utility.getNextMonth("10501");
		assertEquals("10502", ans);
	}

	@Test
	public void testgetTomorrow() throws Exception {
		String ans = Utility.getTomorrow("1050101");
		assertEquals("1050102", ans);
	}

	@Test
	public void testgetYesterday() throws Exception {
		String ans = Utility.getYesterday("1050101");
		assertEquals("1041231", ans);
	}

	@Test
	public void testgetMonthFirstDay() throws Exception {
		String ans = Utility.getMonthFirstDay("1051123");
		assertEquals("1051101", ans);
	}	
	
	@Test
	public void testgetMonthLastDay() throws Exception {
		String ans = Utility.getMonthLastDay("1051123");
		assertEquals("1051130", ans);
	}	

	@Test
	public void testgetWeek() throws Exception {
		int ans = Utility.getWeek("1051123");
		assertEquals(3, ans);
	}	
	
	@Test
	public void testgetWeekFirstDay() throws Exception {
		String ans = Utility.getWeekFirstDay("1051123");
		assertEquals("1051120", ans);
	}	
	
	@Test
	public void testgetWeekLaststDay() throws Exception {
		String ans = Utility.getWeekLastDay("1051123");
		assertEquals("1051126", ans);
	}	
	
}
