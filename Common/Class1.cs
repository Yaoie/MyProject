namespace Common
{
    public static class FileHelper
    {
        public static void WriteFile(string fileName, string rootPath, byte[] buffer)
        {
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            string path = GetFilePath(fileName, rootPath);
            FileInfo file = new FileInfo(path);
            FileStream fs = file.Create();
            fs.Write(buffer, 0, buffer.Length);
            fs.Close();
        }
        public static string GetFilePath(string fileName, string rootPath)
        {
            return rootPath + fileName;
        }
    }
}