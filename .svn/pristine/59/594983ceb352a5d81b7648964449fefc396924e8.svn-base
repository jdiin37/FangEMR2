package library.dateutility;

import library.utility.MapUtil;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.time.temporal.TemporalAdjusters.firstDayOfYear;

/**
 * Created by jeffy on 2017/7/13.
 */
public class DateComputeUtil {

    public static List<String> getStartDateEndDate(String range) {
        LocalDate today = LocalDate.now();
        // default startDate is today before 10 years.
        // default endDate is today.
        String startDate = DateUtil.dateToROCDateString(today.plus(-10, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(today);

        if (range.equals("month")) {
            startDate = DateUtil.dateToROCDateString(today.plus(-1, ChronoUnit.MONTHS));
        }

        if (range.equals("season")) {
            startDate = DateUtil.dateToROCDateString(today.plus(-3, ChronoUnit.MONTHS));
        }

        if (range.equals("halfYear")) {
            startDate = DateUtil.dateToROCDateString(today.plus(-6, ChronoUnit.MONTHS));
        }

        if (range.equals("year")) {
            startDate = DateUtil.dateToROCDateString(today.plus(-1, ChronoUnit.YEARS));
        }

        if (range.contains("|")) {
            startDate = range.split("\\|")[0];
            endDate = range.split("\\|")[1];
        }

        return  Arrays.asList(startDate, endDate);
    }

    private static int getAgesReal(LocalDate startDate, LocalDate endDate) {
        if ((startDate != null) && (endDate != null)) {
            return Period.between(startDate, endDate).getYears();
        } else {
            return 0;
        }
    }

    public static int getAgesReal(String rocStartDate, String rocEndDate) {
        if ((rocStartDate != null) && (rocEndDate != null)) {
            LocalDate adStartDate = DateUtil.rocDateStringToDate(rocStartDate);
            LocalDate adEndDate = DateUtil.rocDateStringToDate(rocEndDate);

            return getAgesReal(adStartDate, adEndDate);
        } else {
            return 0;
        }
    }

    public static int getAgesByYear(String rocStartDate, String rocEndDate) {
        if ((rocStartDate != null) && (rocEndDate != null)) {
            LocalDate startFirstDay = DateUtil.rocDateStringToDate(rocStartDate).with(firstDayOfYear());
            LocalDate endFirstDay = DateUtil.rocDateStringToDate(rocEndDate).with(firstDayOfYear());
            return getAgesReal(startFirstDay, endFirstDay);
        } else {
            return 0;
        }
    }

    public static long getAdmitDays(String rocStartDate, String rocEndDate) {
        long result = 0;
        if (rocStartDate != null && rocStartDate.isEmpty()) rocStartDate = null;
        if (rocEndDate != null && rocEndDate.isEmpty()) rocEndDate = null;


        if (rocStartDate != null && (rocEndDate != null)) {
            result = DAYS.between(DateUtil.rocDateStringToDate(rocStartDate), DateUtil.rocDateStringToDate(rocEndDate));
        }

        if (rocStartDate != null && rocEndDate == null) {
            result = DAYS.between(DateUtil.rocDateStringToDate(rocStartDate), LocalDate.now());
        }

        return result;
    }

    public static int getYear(String rocDateString) {
        return Integer.valueOf(rocDateString.substring(0, 3));
    }

    public static void main(String... args) {
        String range = "0760101|1040804";
        System.out.println("StartDate and EndDate: By Range='0760101|1040804': " + getStartDateEndDate(range));

        range = "month";
        System.out.println("StartDate and EndDate: By Range='month': " + getStartDateEndDate(range));

        range = "season";
        System.out.println("StartDate and EndDate: By Range='season': " + getStartDateEndDate(range));

        range = "halfYear";
        System.out.println("StartDate and EndDate: By Range='halfYear': " + getStartDateEndDate(range));

        range = "year";
        System.out.println("StartDate and EndDate: By Range='year': " + getStartDateEndDate(range));

        String startDate = "1051120";
        String endDate = "1061011";
        System.out.println("The ages for startDate='1051120' endDate='1061011' by getAgesReal: " + getAgesReal(startDate, endDate));
        System.out.println("The ages for startDate='1051120' endDate='1061011' by getAgesByYear: " + getAgesByYear(startDate, endDate));

        System.out.println("The year of '1061030' is=" + getYear("1061030"));

        System.out.println("getAdmitDays '1061030' '1061102' is=" + getAdmitDays("1061030", "1061102"));
    }
}
