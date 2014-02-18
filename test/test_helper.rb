ENV["RAILS_ENV"] ||= "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require "minitest/spec"
require 'capybara/rails'

class ActiveSupport::TestCase
  # Add more helper methods to be used by all tests here...

  # Remove clash between minitest::spec describe and TestCase describe
  # from http://blowmage.com/2013/07/08/minitest-spec-rails4
  class << self
    remove_method :describe
  end

  extend MiniTest::Spec::DSL
end
