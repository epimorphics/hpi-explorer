# Model of the time period selected by the user, with suitable defaults
class TimePeriod
  attr_reader :preferences, :lang, :year_now, :month_now
  attr_reader :from_year, :to_year, :from_month, :to_month

  FIRST_YEAR = 1995

  MONTHS = {
    en: %w(January February March April May June July August September October November December).zip( 1..12 )
  }

  def initialize( preferences, lang = :en )
    @preferences = preferences
    @lang = lang

    @year_now = Time.now.year
    @month_now = Time.now.month

    @from_year = preferences.param( :from_y ) || (year_now - 1)
    @to_year = preferences.param( :to_y ) || year_now

    @from_month = preferences.param( :from_m ) || month_now
    @to_month = preferences.param( :to_m ) || month_now
  end

  def months
    MONTHS[lang]
  end

  def years
    (FIRST_YEAR .. year_now).map &:to_s
  end

end
