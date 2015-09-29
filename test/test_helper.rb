ENV["RAILS_ENV"] ||= "test"
require File.expand_path('../../config/environment', __FILE__)

require 'minitest/autorun'
require 'rails/generators'
require 'minitest/rails'
require 'minitest/rails/capybara'
# require 'minitest/spec'
# require 'minitest/rails-spec'
# require 'rails/test_help'
# require 'capybara/rails'
# require 'minitest/capybara'
# require 'json_expressions/minitest'


class AcceptanceTest < Minitest::Test
  include Capybara::DSL
  include Capybara::Assertions

  def teardown
    Capybara.reset_session!
    Capybara.use_default_driver
  end
end

class AcceptanceSpec < AcceptanceTest
  extend Minitest::Spec::DSL
end

VCR.configure do |c|
  c.cassette_library_dir = 'fixtures/vcr_cassettes'
  c.hook_into :webmock
end
