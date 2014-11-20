class CatchRequestErrors
  def initialize(app)
    @app = app
  end

  def call(env)
    begin
      @app.call(env)
    rescue ActionController::BadRequest => error
      ::Rails.logger.warn("WARN: 400 ActionController::BadRequest: #{env['REQUEST_URI']}")
      @html_400_page ||= File.read(::Rails.root.join('public', 'landing', '400.html'))
      [
          400, { "Content-Type" => "text/html" },
          [ @html_400_page ]
      ]
    rescue ArgumentError => error
      ::Rails.logger.warn("WARN: 400 ArgumentError: #{env['REQUEST_URI']}")
      @html_400_page ||= File.read(::Rails.root.join('public', 'landing', '400.html'))
      [
          400, { "Content-Type" => "text/html" },
          [ @html_400_page ]
      ]
    end
  end
end
