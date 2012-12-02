#!/usr/bin/env ruby -w

require 'uri'

path = 'extras/bookmarklet.js'

if File.exists? path
  js = File.read path
end

js = js.strip.gsub(/\n/,'').gsub(/\s{2,}/,'')

# Kill comments.
js.gsub!( /\/\*.+?\*\/|\/\/.*(?=[\n\r])/, '' )
# Tabs to spaces
js.gsub!( /s{\t}{ }gm/, '' )
# Space runs to one space
js.gsub!( /s{ +}{ }gm/, '' )         
# Kill line-leading whitespace
js.gsub!( /s{^\s+}{}gm/, '' )        
# Kill line-ending whitespace
js.gsub!( /s{\s+$}{}gm/, '' )
# Kill newlines
js.gsub!( /s{\n}{}gm/, '' )


js = URI.escape(js)
print "javascript:(function(){#{js}}());"
