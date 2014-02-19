source 'https://rubygems.org'

gem 'rails', '4.0.2'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.0'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .js.coffee assets and views
# gem 'coffee-rails', '~> 4.0.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

gem 'haml-rails'
# gem 'less-rails'
gem 'bootstrap-sass'

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.1.2'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
gem 'capistrano-rails', group: :development
# gem 'capistrano-chruby', group: :development
gem 'capistrano-bundler', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]
gem 'pry', group: :development

gem 'govuk_frontend_toolkit', github: "alphagov/govuk_frontend_toolkit_gem", :submodules => true
gem 'data-services-api', git: "git@github.com:epimorphics/ds-api-ruby.git"
gem 'font-awesome-rails'

group :test do
  gem 'minitest', '~> 4.7'
  gem 'minitest-rg', '~> 1.1'
  gem 'capybara-webkit', '~> 1.1'
  gem 'minitest-capybara', '~> 0.4'
  gem 'minitest-spec-rails', '~> 4.7'
  gem 'json_expressions', "~> 0.8"
end

