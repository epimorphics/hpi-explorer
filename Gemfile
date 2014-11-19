source 'https://rubygems.org'

gem 'rails', '4.1.8'
gem 'turbolinks'
gem 'jbuilder', '~> 1.2'
gem 'data_services_api', git: "git@github.com:epimorphics/ds-api-ruby.git"
gem 'faraday', '~> 0.8.8'
gem "faraday_middleware", "< 0.9.0"
gem 'js-routes'
gem 'leaflet-rails'
gem 'haml-rails'

#gem 'qonsole-rails', path: '/home/ian/workspace/qonsole-rails'
gem 'qonsole-rails', git: 'git@github.com:epimorphics/qonsole-rails.git'

gem 'font-awesome-rails'
gem 'bootstrap-sass'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'jquery-datatables-rails', git: 'git://github.com/rweng/jquery-datatables-rails.git'
gem 'therubyracer', platforms: :ruby
gem 'govuk_frontend_toolkit', github: "alphagov/govuk_frontend_toolkit_gem", :submodules => true

gem 'uglifier', '>= 1.3.0'
gem 'sass-rails', '~> 4.0.0'

# locking due to version problems
gem 'sass', '3.2.14'
gem 'slop', '3.4.7'
gem 'sprockets', '2.11.0'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

group :test do
  gem 'capybara-webkit', '~> 1.1'
  gem 'minitest-capybara'
  gem 'capybara_minitest_spec'
  gem 'minitest-spec-rails', '~> 5.1'
  gem 'minitest-rails'
  gem 'json_expressions', "~> 0.8"
  gem 'vcr'
  gem 'minitest-vcr'
  gem 'webmock'
end

group :development do
  gem 'unicorn'
  gem 'quiet_assets'
end

group :test, :development do
  gem 'rb-readline'
  gem 'pry'
end

