# = Gemfile containing requirements for this app =
#     see http://gembundler.com/ for more on how to use this file
# source (there are others but whatever)
source :rubygems

# server
gem 'thin'
gem 'foreman'
# rack
gem 'rack'

# sinatra
gem 'sinatra'
gem 'sinatra-partial'
gem 'sinatra-flash', require: 'sinatra/flash' # enables flash[:notice] && flash[:error]

# faster better stronger
gem 'erubis'

# asset stuff
gem 'haml'
gem "sass", :require => 'sass'
gem 'coffee-script'   # build the JS
gem 'compass'         # build the CSS
gem 'execjs'

# sprockets galore
gem 'sprockets'
gem 'sprockets-sass'
gem 'sprockets-helpers'

group :production do
  gem 'pony'
end
