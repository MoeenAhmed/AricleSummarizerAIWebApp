using OpenAI;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using OpenAI.Assistants;
using System.ClientModel;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfAnlyzerController : ControllerBase
    {
        [HttpGet("AnalyzePdf")]
        public async Task<IActionResult> AnalyzePdf(string pdfContent)
        {
            //ChatClient chatClient = new ChatClient(model: "gpt4o", apiKey: "Your Open Ai Token");

            //// Set model context
            //List<ChatMessage> messages = new List<ChatMessage>
            //{
            //    new SystemChatMessage("Document anlyzer AI agent")
            //};

            //string prompt = $$"""
            //                    You will be provided with a pdf file content of an article 
            //                    you need to anlyze it and return and a title and summary 
            //                    off in 50 words in a given response format.
            //                    PDF file content is: {{pdfContent}}
            //                    Response format is
            //                    {
            //                        "Title":"The is article title",
            //                        "Summary" :"This is article summary"
            //                    }
            //                """;

            //messages.Add(new UserChatMessage(prompt));

            //ChatCompletion chatCompletion = await chatClient.CompleteChatAsync(messages);

            //string agentResponse = chatCompletion.Content[0].Text;

            //messages.Add(agentResponse);

            //return Ok(agentResponse);

            var chathistory = new List<ChatMessage>();
            var credential = new ApiKeyCredential("Your Git Hub Token"); 

            var openAIOptions = new OpenAIClientOptions()
            {
                Endpoint = new Uri("https://models.inference.ai.azure.com")
            };

            var client = new OpenAIClient(credential, openAIOptions);

            var chatCLient = client.GetChatClient("gpt-4o");

            var requestOptions = new ChatCompletionOptions()
            {
                Temperature = 1,
                MaxOutputTokenCount = 1000,
            };


            string userPrompt = $$"""
                                You will be provided with a pdf file content of an article 
                                you need to anlyze it and return and a title and summary 
                                off in 100 words and comos seperated string of tags in a given response format.
                                PDF file content is: {{pdfContent}}
                                Response format is
                                {
                                    "Title":"The is article title",
                                    "Summary" :"This is article summary",
                                    "Tags":"Cricket, Batsman, Ball"s
                                }
                                Note: Give me plain json string don not include ```json in response 
                            """;

            chathistory.Add(userPrompt);

            ClientResult<ChatCompletion>? response = await chatCLient.CompleteChatAsync(chathistory, requestOptions);


            return Ok(new { status = "success", response = response.Value.Content[0].Text });
        }

        [HttpPost("HandleFileUpload")]
        public async Task<IActionResult> HandleFileUpload(IFormFile file)
        {
            string fileContent;
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                fileContent = await reader.ReadToEndAsync();
            }
            return await AnalyzePdf(fileContent);
            
        }
    }


}
