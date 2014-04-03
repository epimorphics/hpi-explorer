# Model of the time period selected by the user, with suitable defaults
# NB: month stored internally in JavaScript format (zero indexed)
class TimePeriod
  attr_reader :preferences, :lang, :year_now, :month_now
  attr_reader :from_y, :to_y, :from_m, :to_m

  FIRST_YEAR = 1995

  MONTHS = {
    en: %w(January February March April May June July August September October November December).zip( 0..11 )
  }

  def initialize( preferences, lang = :en )
    @preferences = preferences
    @lang = lang

    @year_now = Time.now.year
    @month_now = Time.now.month - 1 # -1 because Javascript months start at 0, not 1

    @from_y = preferences.param( :from_y ) || (year_now - 1)
    @to_y = preferences.param( :to_y ) || year_now

    @from_m = preferences.param( :from_m ) || month_now
    @to_m = preferences.param( :to_m ) || month_now
  end

  def months
    MONTHS[lang]
  end

  def years
    (FIRST_YEAR .. year_now).map &:to_s
  end

  def last_twelve_months
    {from_m: month_now, from_y: year_now - 1,
     to_m: month_now, to_y: year_now}
  end

  def year_to_date
    {from_m: 0, from_y: year_now,
     to_m: month_now, to_y: year_now}
  end

  def last_calendar_year
    {from_m: 0, from_y: year_now - 1,
     to_m: 11, to_y: year_now - 1}
  end

  def last_twelve_months_path( controller, options = {}, delete = [] )
    as_path( controller, options, delete, last_twelve_months )
  end

  def year_to_date_path( controller, options = {}, delete = [] )
    as_path( controller, options, delete, year_to_date )
  end

  def last_calendar_year_path( controller, options = {}, delete = [] )
    as_path( controller, options, delete, last_calendar_year )
  end

  def date_value( key_y, key_m )
    m = self.send( key_m )
    y = self.send( key_y )

    {"@value" => format('%04d-%02d', y, m.to_i + 1 ),
     "@type" => "http://www.w3.org/2001/XMLSchema#gYearMonth"}
  end

  def negative?
    (from_y.to_i > to_y.to_i) || (from_y == to_y && from_m.to_i > to_m.to_i)
  end

  private

  def as_path( controller, options, delete, period_options )
    preferences.as_path( controller, options.merge( period_options ), delete )
  end
end
