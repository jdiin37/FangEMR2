package library.dateutility;

import static org.junit.Assert.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.Test;

public class TwoDateTest {

	@Test
	public void test() throws Exception {
		try {
			String ROC_DATE1="1050101";
			String ROC_DATE2="1060102";
			TwoDate twoDate= new TwoDate(ROC_DATE1, ROC_DATE2);
			int _years = twoDate.Year();
			int _months = twoDate.Month();
			int days = twoDate.Day();
			assertEquals(1, _years);
			assertEquals(0, _months);
			assertEquals(1, days);
		} catch (ParseException e) {
			e.printStackTrace();
			fail("Not yet implemented");
		}
	}

}
