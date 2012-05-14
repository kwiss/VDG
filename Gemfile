# = Gemfile containing requirements for this app =
#     see http://gembundler.com/ for more on how to use this file
# source (there are others but whatever)
source :rubygems

gem 'rack'
gem 'thin'
gem 'sinatra'
gem 'sinatra-reloader'
gem 'sinatra-partial'
gem 'sinatra-flash', require: 'sinatra/flash'

# asset stuff
gem 'haml'
gem 'sass'
gem 'coffee-script'
gem 'sprockets'
gem 'sprockets-sass'
gem 'sprockets-helpers'
gem 'compass'

group :development do
  gem 'foreman'
  gem 'heroku'
end

group :production do
  gem 'pony'
  gem 'uglifier'
end
