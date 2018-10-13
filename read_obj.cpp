#include<iostream>
#include<string>
#include<fstream>
#include<sstream>
using namespace std;
#include<vector>

int main(){

    ifstream fileIn;
    fileIn.open("2009_004315.obj");
    string line;
    std::vector<std::vector<string> > content_parseado;

     while (getline(fileIn,line))
    {

        string item;
        std::stringstream sstr(line);
        std::vector<string> line_parsed;
        // Read in an item
        while (getline(sstr, item, ' '))
        {
            line_parsed.push_back(item);
        }
        content_parseado.push_back(line_parsed);
    }

    ofstream output("2009_004315.mesh");
    for (int i = 0; i < content_parseado.size(); ++i)
    {
        if (content_parseado[i][0]=="v")
        {
            /* code */
           
            string x_ = content_parseado[i][1];
            string y_ = content_parseado[i][2];
            int x = stoi(x_);
                x = (x<0)?0:x;
            int y = stoi(y_);
                y = (y<0)?0:y;
            output<<"["<<x<<","<<y<<"], ";
        }
    }
    output.close();

return 1;
}