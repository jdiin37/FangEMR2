package library.dateutility;

import static org.junit.Assert.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.Test;

public class TransformTest {

	@Test
	public void testROCDateStringToDate() {
		try {
			SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
			Date testDate=sdFormat.parse("20161111");
			Date ans = Transform.ROCDateStringToDate("1051111");
			assertEquals(testDate, ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}		
	}

	@Test
	public void testROCDateTimeStringToDate() {
		try {
			SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmm");
			Date testDate=sdFormat.parse("201611110101");
			Date ans = Transform.ROCDateTimeStringToDate("10511110101");
			assertEquals(testDate, ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testDateToROCDateString() {
		try {
			Date testDate=Transform.ADDateStringToDate("20151231");
			String ans = Transform.DateToROCDateString(testDate);
			assertEquals("1041231", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testDateToROCDateTimeString() {
		try {
			Date testDate=Transform.ROCDateTimeStringToDate("10101010101");
			String ans = Transform.DateToROCDateTimeString(testDate);
			assertEquals("10101010101", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testADDateStringToDate() {
		try {
			SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
			Date testDate=sdFormat.parse("20161111");
			Date ans = Transform.ADDateStringToDate("20161111");
			assertEquals(testDate, ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testADDateTimeStringToDate() {
		try {
			SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMddHHmm");
			Date testDate=sdFormat.parse("201611110101");
			Date ans = Transform.ADDateTimeStringToDate("201611110101");
			assertEquals(testDate, ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testDateToADDateString() {
		try {
			Date testDate=Transform.ADDateStringToDate("20120101");
			String ans = Transform.DateToADDateString(testDate);
			assertEquals("20120101", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testDateToADDateTimeString() {
		try {
			Date testDate=Transform.ADDateTimeStringToDate("201201010101");
			String ans = Transform.DateToADDateTimeString(testDate);
			assertEquals("201201010101", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testROCDateStringFormat() {
		try {
			String ans = Transform.ROCDateStringFormat("1050101");
			assertEquals("105/01/01", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testROCDateTimeStringFormat() {
		try {
			String ans = Transform.ROCDateTimeStringFormat("10501010101");
			assertEquals("105/01/01 01:01", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testADDateStringFormat() {
		try {
			String ans = Transform.ADDateStringFormat("20160101");
			assertEquals("2016/01/01", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testADDateTimeStringFormat() {
		try {
			String ans = Transform.ADDateTimeStringFormat("201601010101");
			assertEquals("2016/01/01 01:01", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testROCDateStringToADDateString() {
		try {
			String ans = Transform.ROCDateStringToADDateString("1050101");
			assertEquals("20160101", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

	@Test
	public void testADDateStringToROCDateString() {
		try {
			String ans = Transform.ADDateStringToROCDateString("20160101");
			assertEquals("1050101", ans);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

}
