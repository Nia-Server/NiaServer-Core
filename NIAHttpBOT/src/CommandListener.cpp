#include "CommandListener.h"


void listenForCommands(const char* programName) {

    using CommandHandler = std::function<void(const std::vector<std::string>&)>;

    std::unordered_map<std::string, CommandHandler> commandMap;

    commandMap["help"] = [](const std::vector<std::string>&) {
        std::cout << "可用指令列表：" << std::endl;
        std::cout << "  reload - 重启程序" << std::endl;
        std::cout << "  stop - 关闭程序" << std::endl;
        std::cout << "  setcfg <cfgname> <cfgdata> - 设置配置项" << std::endl;
    };

    commandMap["reload"] = [programName](const std::vector<std::string>&) {
        INFO("1s后重启程序..." );
        std::this_thread::sleep_for(std::chrono::seconds(1));
        #ifdef _WIN32
        std::system(("start cmd /k " + std::string(programName)).c_str());
        #else
        if (fork() == 0) {
            execl(programName, programName, (char*)NULL);
        }
        #endif
        exit(0);
    };

    commandMap["stop"] = [](const std::vector<std::string>&) {
        INFO("1s后将关闭程序...");
        std::this_thread::sleep_for(std::chrono::seconds(1));
        exit(0);
    };

    commandMap["setcfg"] = [](const std::vector<std::string>& args) {
        if (args.size() < 3) {
            WARN("setcfg 指令需要两个参数: <cfgname> <cfgdata>");
            return;
        }
        std::string cfgname = args[1];
        std::string cfgdata = args[2];
    };

    // 启动输入监听线程
    std::thread inputThread([&commandMap]() {
        std::string line;
        while (std::getline(std::cin, line)) {
            std::istringstream iss(line);
            std::vector<std::string> tokens;
            std::string token;
            while (iss >> token) {
                tokens.push_back(token);
            }
            if (tokens.empty()) {
                continue;
            }
            auto it = commandMap.find(tokens[0]);
            if (it != commandMap.end()) {
                it->second(tokens); // 调用对应的处理函数
            } else {
                std::cout << "未知指令，请检查后再次输入！" << std::endl;
            }
        }
    });

    // 等待输入线程完成
    inputThread.join();
}