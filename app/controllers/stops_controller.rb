class StopsController < ApplicationController

  respond_to :json

  def index

    params.except(:origin, :destination)

    # query for the trip
    jid = TripWorker.perform_async(params[:origin],params[:destination])

    # return the job id to the browser
    response = {"job" => jid }
    respond_with response

  end 

  def show 

    puts 'in show routine'

    params.except(:id)

    sidekiq_job = SidekiqStatus::Container.load(params[:id])

    # get the response status
    response = {:status => "working"} 

    # get the response from job status
    response = {:status => "complete", :data => sidekiq_job.payload } if ( sidekiq_job.status == "complete" )
    response = {:status => "failed"} if ( sidekiq_job.status == "failed" )  

    respond_with response

  end 

end